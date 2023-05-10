"use client";

import Chat from "./components/Chat";
import CSVCreator from "./components/CSVCreator";
import UploadFile from "./components/uploadFile";

export default function Home() {
  return (
    <main className="flex bg-gray-100 min-h-screen flex-col items-center p-6 md:p-24 lg:p-24 overscroll-contain ">
      <div className="text-center">
        <h1 className="text-lg font-bold">File Vision</h1>
        {/* {fileUrl ? (
          <p className="text-sm text-slate-700">
            Clous Based Custom CSV File Is Used{" "}
          </p>
        ) : (
          <p className="text-sm text-slate-700">
            Current File Used Is -{" "}
            {
              <span className="underline text-blue-400">
                <Link
                  href={
                    "https://www.kaggle.com/datasets/sougatapramanick/happiness-index-2018-2019?resource=download"
                  }
                >
                  Happiness Index 2018-2019
                </Link>
              </span>
            }
          </p>
        )}
        <input
          type="text"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          className={`w-full bg-gray-200 p-3 block mt-2 rounded-md focus:outline-none text-slate-900  text-sm `}
          placeholder="Paste CSV Public Acess URL"
        /> */}

        <div className="flex justify-center">
          <UploadFile />
        </div>
      </div>
      {/* <Chat /> */}
      <CSVCreator />
    </main>
  );
}
