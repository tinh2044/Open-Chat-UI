import { Ollama } from 'ollama';
import { Readable } from 'stream';
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { setEventStreamResponse, FetchWithAuth } from '@/server/utils';
import { PrismaClient } from '@prisma/client';

const SYSTEM_TEMPLATE = `Answer the user's questions based on the below context.
Your answer should be in the format of Markdown.

If the context doesn't contain any relevant information to the question, don't make something up and just say "I don't know":

<context>
{context}
</context>
`;

export default defineEventHandler(async (event) => {
  setEventStreamResponse(event);

  const { host, username, password } = event.context.ollama;
  const { knowledgebaseId, model, messages, stream } = await readBody(event);

  if (knowledgebaseId) {
    console.log("Chat with knowledge base with id: ", knowledgebaseId);
    const prisma = new PrismaClient();
    const knowledgebase = await prisma.knowledgeBase.findUnique({
      where: {
        id: knowledgebaseId,
      },
    });
    console.log(`Knowledge base ${knowledgebase?.name} with embedding "${knowledgebase?.embedding}"`);
    if (!knowledgebase) {
      setResponseStatus(event, 404, `Knowledge base with id ${knowledgebaseId} not found`);
      return;
    }

    const embeddings = new OllamaEmbeddings({
      model: `${knowledgebase.embedding}`,
      baseUrl: "http://localhost:11434",
    });
    const retriever = new Chroma(embeddings, {
      collectionName: `collection_${knowledgebase.id}`
    }).asRetriever(4);

    const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
      ["system", SYSTEM_TEMPLATE],
      new MessagesPlaceholder("messages"),
    ]);

    const chat = new ChatOllama({
      baseUrl: "http://localhost:11434",
      model: model,
    });

    const query = messages[messages.length - 1].content
    console.log("User query: ", query);

    const relevant_docs = await retriever.invoke(query);
    console.log("Relevant documents: ", relevant_docs);

    const documentChain = await createStuffDocumentsChain({
      llm: chat,
      prompt: questionAnsweringPrompt,
    });

    const parseRetrieverInput = (params) => {
      return params.messages[params.messages.length - 1].content;
    };

    const retrievalChain = RunnablePassthrough.assign({
      context: RunnableSequence.from([parseRetrieverInput, retriever]),
    }).assign({
      answer: documentChain,
    });

    const response = await retrievalChain.stream({
      messages: [new HumanMessage(query)],
    });

    console.log(response);
    const readableStream = Readable.from((async function* () {
      for await (const chunk of response) {
        const message = {
          message: {
            role: 'assistant',
            content: chunk?.answer
          }
        };
        yield `${JSON.stringify(message)}\n\n`;
      }
    })());
    return sendStream(event, readableStream);
  } else {
    const ollama = new Ollama({ host, fetch: FetchWithAuth.bind({ username, password }) });

    const response = await ollama.chat({ model, messages, stream });

    const readableStream = Readable.from((async function* () {
      for await (const chunk of response) {
        yield `${JSON.stringify(chunk)}\n\n`;
      }
    })());
    return sendStream(event, readableStream);
  }
})
