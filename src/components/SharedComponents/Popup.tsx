import React from "react";

interface PopupProps {
  type: "success" | "error"; // ✅ Success or Error type
  title?: string;
  message: string;
  data?: PopupData;
  onClose: () => void;
}

interface PopupData {
  additionalInfo?: string;
  timestamp?: string;
}

const Popup: React.FC<PopupProps> = ({ type, title, message, data, onClose }) => {
  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className={`bg-white p-6 rounded-lg shadow-lg w-96 text-center border ${isSuccess ? "border-green-500" : "border-red-500"}`}>
        <h2 className={`text-lg font-semibold mb-2 ${isSuccess ? "text-green-600" : "text-red-600"}`}>
          {title ?? (isSuccess ? "Success" : "Error")}
        </h2>
        <p className="text-gray-700">{message}</p>
        {data && <p className="mt-2 text-gray-500">{JSON.stringify(data)}</p>}
        
        <button
          onClick={onClose}
          className={`mt-4 px-4 py-2 rounded-lg text-white ${isSuccess ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Popup;
