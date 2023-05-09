import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";

import { RetrievalQAChain } from "langchain/chains";
import fs from "fs";
import path from "path";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: Request) {
  try {
    const dirRelativeToPublicFolder = "csvs";
    const dir = path.resolve("./public", dirRelativeToPublicFolder);
    const filenames = fs.readdirSync(dir);
    const file = filenames.map((name) =>
      path.join("/", dirRelativeToPublicFolder, name)
    )[0];

    const input = await request.json();
    console.log(file);

    const loader = new CSVLoader(file);
    const docs = await loader.load();
    const vectorStore = await MemoryVectorStore.fromDocuments(
      docs,
      new OpenAIEmbeddings()
    );
    const model = new OpenAI({
      openAIApiKey: OPENAI_API_KEY,
      maxTokens: 256,
      // temperature: 0.1,
    });
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
    const res = await chain.call({
      query: `Always try to provide answer with the dataset provided. You are supposed to answer questions from data provided. ${input}`,
    });

    return new Response(res.text);
  } catch (e) {
    console.log(e);
    return Response.error();
  }
}
