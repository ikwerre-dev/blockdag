import { Download, Share2, Copy, SearchIcon, Info } from "lucide-react";
import { useRouter } from 'next/navigation';
import Image from "next/image";

interface ReceiptProps {
  transaction: {
    id: string;
    type: "sent" | "received";
    amount: number;
    currency: string;
    recipient?: string;
    sender?: string;
    date: string;
    hash: string;
    status: string;
    reference?: string;
    fee?: number;
    metaData?: string | { [key: string]: any }; // Allow metaData to be a string or object
  };
  minimal?: boolean;
}

// Helper function to convert camelCase to human-readable format
const camelCaseToHumanReadable = (str: string): string => {
  return str
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (s) => s.toUpperCase()) // Capitalize first letter
    .trim(); // Remove any leading/trailing spaces
};

export default function Receipt({ transaction, minimal = false }: ReceiptProps) {
  const router = useRouter();
  const handleDownload = () => {
    window.print();
  };

  console.log(transaction);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Transaction Receipt",
        text: `Transaction receipt for ${transaction.id}`,
        url: window.location.href,
      });
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transaction.hash);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };
  // Parse metaData to ensure it's an object
  let metaDataObj: { [key: string]: any } = {};
  try {
    if (typeof transaction.metaData === "string") {
      metaDataObj = JSON.parse(transaction.metaData);
    } else if (transaction.metaData && typeof transaction.metaData === "object") {
      metaDataObj = transaction.metaData;
    }
  } catch (error) {
    console.error("Failed to parse metaData as JSON:", error);
  }

  // Get all metaData fields
  const metaDataFields = Object.keys(metaDataObj);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {minimal != true && (
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Transaction Receipt</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-[#194dbe] rounded-lg hover:bg-gray-100"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-[#194dbe] rounded-lg hover:bg-gray-100"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}


      <div className="p-6 space-y-6">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="VelTrust Logo"
            width={150}
            height={40}
            className="h-8 w-auto"
          />
        </div>

        <div className="space-y-4">

          {transaction.status === 'pending' ?
            (<>
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Info className="w-8 h-8 text-orange-600" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Transaction Pending!</h1>
                <p className="text-gray-500 mb-6">
                  Your Transaction has been put on Hold.
                </p>
                <p className="text-gray-500 font-bold mb-6">
                  Please contact the support with your tracking ID
                </p>
              </div>
            </>
            ) : ''}
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Transaction ID</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800">{transaction.hash}</span>
              <button
                onClick={handleCopy}
                className="p-1.5 text-gray-600 hover:text-[#194dbe] rounded-lg hover:bg-gray-100"
                title="Copy Transaction ID"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => router.push(`/dashboard/tracking?hash=${transaction.hash}`)}
                className="p-1.5 text-gray-600 hover:text-[#194dbe] rounded-lg hover:bg-gray-100"
                title="Track Transaction"
              >
                <SearchIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Date</span>
            <span className="font-medium text-gray-800">
              {new Date(transaction.date).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Type</span>
            <span className="font-medium text-gray-800 capitalize">
              {transaction.type}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">
              {transaction.type === "sent" ? "Recipient" : "Sender"}
            </span>
            <span className="font-medium text-gray-800">
              {transaction.type === "sent"
                ? transaction.recipient
                : transaction.sender}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Amount</span>
            <span className="font-medium text-gray-800">
              {transaction.currency} {Number(transaction.amount).toFixed(2)}
            </span>
          </div>
          {/* Render all metaData fields after Amount */}
          {metaDataFields.map((key) => (
            <div
              key={key}
              className="flex justify-between py-2 border-b border-gray-100"
            >
              <span className="text-gray-600">
                {camelCaseToHumanReadable(key)}
              </span>
              <span className="font-medium text-gray-800">
                {typeof metaDataObj[key] === "number"
                  ? metaDataObj[key].toFixed(2)
                  : metaDataObj[key].toString()}
              </span>
            </div>
          ))}
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Status</span>
            <span className={`font-medium capitalize ${transaction.status === 'pending' ? 'text-yellow-600' :
              transaction.status === 'paid' ? 'text-green-600' :
                transaction.status === 'unpaid' ? 'text-red-600' :
                  'text-gray-600'
              }`}>
              {transaction.status}
            </span>
          </div>
          {transaction.reference && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Reference</span>
              <span className="font-medium text-gray-800">
                {transaction.reference}
              </span>
            </div>
          )}

        </div>
        {minimal != true && (

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>This is an electronic receipt for your records.</p>
            <p>Thank you for using VelTrust!</p>
          </div>
        )}
      </div>
    </div>
  );
}