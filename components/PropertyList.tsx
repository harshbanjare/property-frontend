import type { Property } from "@/types/properties";
type PropertyListParams = {
  properties: Property[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  loading: boolean;
  error: string;
};

export const PorpertyList = ({
  properties,
  searchTerm,
  setSearchTerm,
  loading,
  error,
}: PropertyListParams) => {
  const renderList = () => {
    if (loading) {
      return <div className="flex justify-center items-center">Loading...</div>;
    } else if (error) {
      return (
        <div className="flex justify-center items-center text-red-500">
          {error}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2 max-h-[750px] overflow-y-auto">
        {properties.map((property) => (
          <div
            className="flex flex-col bg-gray-50 border border-black rounded-lg p-3 gap-2 shadow-sm hover:shadow-md hover:bg-blue-100 transition-all"
            key={property.id}
          >
            <div className="font-semibold text-gray-800">{property.name}</div>
            <div className="text-sm text-gray-600">{property.city}</div>
            <div className="text-lg font-bold ">
              {property.pricePerNight}/night
            </div>
            <div
              className={`text-xs font-medium ${property.isActive ? "text-green-600" : "text-red-600"}`}
            >
              {property.isActive ? "● Active" : "● Inactive"}
            </div>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="border border-gray-700 rounded-sm p-4 min-w-[550px] flex flex-col gap-4">
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="bg-gray-200 p-2 rounded-sm border w-full"
        />
      </div>
      {renderList()}
    </div>
  );
};
