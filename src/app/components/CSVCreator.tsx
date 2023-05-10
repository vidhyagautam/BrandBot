import { firestore } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { IStoredFile } from "./uploadFile";
import * as Select from "@radix-ui/react-select";
import { Cross2Icon, UploadIcon } from "@radix-ui/react-icons";

interface Props {}

const CSVCreator: NextPage<Props> = () => {
  const db = firestore;

  const [templates, setTemplates] = useState<IStoredFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [docFile, setDOCFile] = useState<File | null>();

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const [createdCSV, setCreatedCSV] = useState<Blob | null>(null);

  const fethcData = () => {
    setLoading(true);
    const col = collection(db, "CSVFiles");

    const unsub = onSnapshot(
      col,
      (snapshot) => {
        const templates = snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id } as IStoredFile;
        });
        setTemplates(templates);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        console.log(error);
      }
    );
  };

  useEffect(() => {
    fethcData();
  }, []);

  const startProcess = async () => {
    if (docFile && selectedTemplate) {
      try {
        setProcessing(true);
        console.log(selectedTemplate);
        const formData = new FormData();
        formData.append("doc", docFile);
        formData.append("templateUrl", selectedTemplate);
        const res = await fetch("/api/csv/", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        // const csv =
        //   `${data.columns}\n` + `${Object.values(data.data).join(",")}`;
        // console.log(csv);
        const csv = csvmaker(data.data);
        download(csv);
        // const blob = new Blob([csv], { type: "text/csv" });
        // setCreatedCSV(blob);
        console.log(data);
      } catch (e) {
        console.log(e);
      } finally {
        setProcessing(false);
      }
    }
  };

  const download = (data: any) => {
    // Creating a Blob for having a csv file format
    // and passing the data with type
    const blob = new Blob([data], { type: "text/csv" });

    // Creating an object for downloading url
    const url = window.URL.createObjectURL(blob);

    // Creating an anchor(a) tag of HTML
    const a = document.createElement("a");

    // Passing the blob downloading url
    a.setAttribute("href", url);

    // Setting the anchor tag attribute for downloading
    // and passing the download file name
    a.setAttribute("download", "download.csv");

    // Performing a download with click
    a.click();
  };
  const csvmaker = (data: any) => {
    // Empty array for storing the values
    let csvRows = [];

    // Headers is basically a keys of an
    // object which is id, name, and
    // profession
    const headers = Object.keys(data);

    // As for making csv format, headers
    // must be separated by comma and
    // pushing it into array
    csvRows.push(headers.join(","));

    // Pushing Object values into array
    // with comma separation
    const values = Object.values(data)
      .map((d) => (Array.isArray(d) ? d[0] : d))
      .join(",");
    csvRows.push(values);

    // Returning the array joining with new line
    return csvRows.join("\n");
  };
  return (
    <div className=" w-full border border-slate-300 rounded-md p-4 mt-4">
      {loading ? (
        <p>Fetching templates...</p>
      ) : (
        <div className="flex flex-col space-y-2">
          <label>Select a template</label>
          <select
            name="templates"
            id="temps"
            className="p-2 bg-slate-200 rounded-md"
            onChange={(e) => setSelectedTemplate(e.target.value)}
          >
            {templates.map((temp, i) => (
              <option key={i} value={temp.fileStorage.downloadUrl}>
                {temp.templateName}
              </option>
            ))}
          </select>
        </div>
      )}
      <fieldset className="mb-[15px] mt-4">
        <p className=" w-full text-left text-[15px]">Select Doc File</p>
        <label
          className=" w-full text-center text-[15px] flex justify-center items-center mt-2 h-12 border border-dotted border-slate-400 rounded-md "
          htmlFor="docfile"
        >
          <UploadIcon className="" />
        </label>
        <input
          // className=" focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none  outline-none focus:border  focus:border-slate-400"
          id="docfile"
          type="file"
          accept=".docx"
          hidden
          onChange={(e) => {
            const files = e.target.files;
            console.log(files ? files[0] : "");

            if (files) {
              setDOCFile(files[0]);
            }
          }}
        />
        {docFile ? (
          <button
            className="inline-flex space-x-2 text-xs items-center px-2 bg-gray-200 rounded-sm py-2 mt-2"
            onClick={() => setDOCFile(null)}
          >
            <p>{docFile.name}</p>
            <Cross2Icon />
          </button>
        ) : (
          ""
        )}
      </fieldset>
      <button
        className="bg-green-300 text-green11 text-sm hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:border  focus:border-slate-400 focus:outline-none"
        disabled={processing}
        onClick={startProcess}
      >
        {processing ? (
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-4 h-4  text-gray-200 animate-spin dark:text-gray-600 fill-slate-300"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          "Start Process"
        )}
      </button>
    </div>
  );
};

export default CSVCreator;
