import ActionTableItem from "../Table/Table";

const Table = () => {
  return (
    <div>
      <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6"></div>

      <ActionTableItem
        brandName="Google"
        visitors="3.5K"
        revenues="$5,768"
        sales="590"
        conversion="4.8%"
      />
    </div>
  );
};

export default Table;
