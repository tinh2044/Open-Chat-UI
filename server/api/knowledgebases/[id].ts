import { PrismaClient, type KnowledgeBase } from '@prisma/client';

const listKnowledgeBase = async (id?: string): Promise<KnowledgeBase | null> => {
  const prisma = new PrismaClient();
  try {

    console.log("Knowledge Base ID: ", id);

    let knowledgeBase = null;

    if (id) {
      knowledgeBase = await prisma.knowledgeBase.findUnique({
        where: {
          id: parseInt(id)
        }
      });
    }

    return knowledgeBase;
  } catch (error) {
    console.error(`Error fetching knowledge base with id ${id}:`, error);
    return null;
  }
}

export default defineEventHandler(async (event) => {
  const id = event?.context?.params?.id;
  const knowledgeBase = await listKnowledgeBase(id);
  return { knowledgeBase }
})
