import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type PageInput = { text: string; imageUrl: string };

type CreateStoryBody = {
  slug: string;
  title: string;
  description: string;
  ageMin: number;
  ageMax: number;
  moralTopics: string[];
  healthTopics: string[];
  coverImageUrl?: string;
  pages: PageInput[];
};

export async function POST(request: Request) {
  const body = (await request.json()) as CreateStoryBody;

  if (!body.slug || !body.title || body.pages.length === 0) {
    return NextResponse.json(
      { error: "slug, titolo e almeno una pagina sono obbligatori" },
      { status: 400 }
    );
  }

  const ageLabel = `${body.ageMin}-${body.ageMax} anni`;

  const story = await db.story.create({
    data: {
      slug: body.slug,
      coverImageUrl: body.coverImageUrl || null,
      status: "DRAFT",
      ageRanges: {
        connectOrCreate: {
          where: { label: ageLabel },
          create: { label: ageLabel, minAge: body.ageMin, maxAge: body.ageMax },
        },
      },
      moralTopics: {
        connectOrCreate: body.moralTopics.map((slug) => ({
          where: { slug },
          create: { slug },
        })),
      },
      healthTopics: {
        connectOrCreate: body.healthTopics.map((slug) => ({
          where: { slug },
          create: { slug },
        })),
      },
      translations: {
        create: {
          locale: "it",
          title: body.title,
          description: body.description,
        },
      },
      pages: {
        create: body.pages.map((p, i) => ({
          order: i + 1,
          imageUrl: p.imageUrl,
          translations: { create: { locale: "it", text: p.text } },
        })),
      },
    },
  });

  return NextResponse.json({ id: story.id, slug: story.slug }, { status: 201 });
}
