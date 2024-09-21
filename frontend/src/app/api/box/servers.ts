import { prisma } from "@/lib/prisma";

export function createBox(data: {
  name: string;
  content: string;
  creatorAddress: string;
  apy: number | undefined;
}) {
  return prisma.box.create({ data });
}

export function getBoxListByCreatorAddress(creatorAddress: string) {
  return prisma.box.findMany({ where: { creatorAddress } });
}

export function getBoxById(id: number) {
  return prisma.box.findUnique({ where: { id } });
}