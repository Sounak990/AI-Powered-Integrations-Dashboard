import { Card, CardContent } from "@/components/ui/card";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const IntegrationCard = ({ title, icon: Icon, connected, FormComponent, setModalOpen, buttonText }) => (
  <Card className="bg-gray-800 border border-gray-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
    <CardContent className="p-6 flex flex-col items-center space-y-4">
      {/* Icon and Title Side by Side */}
      <div className="flex items-center gap-2 text-2xl font-semibold text-white">
        {Icon && <Icon size={26} className="text-blue-400" />}
        <span>{title}</span>
      </div>
      <div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full flex items-center gap-2 ${connected ? 'bg-green-700 text-green-100' : 'bg-red-700 text-red-100'}`}>
          {connected ? <FaCheckCircle size={14} /> : <FaTimesCircle size={14} />}
          {connected ? "Connected" : "Not Connected"}
        </span>
      </div>
      <div>
        {FormComponent}
        <button
          className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-500 hover:to-green-700 transition-all shadow-md"
          onClick={() => setModalOpen && setModalOpen(true)}
        >
          {buttonText}
        </button>
      </div>
    </CardContent>
  </Card>
);

export default IntegrationCard;
