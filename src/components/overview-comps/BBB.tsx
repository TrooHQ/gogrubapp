import clsx from "clsx";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Rectangle,
  CartesianGrid,
} from "recharts";
import ArrowDown from "../../assets/ArrowDown.svg";
import styles from "./Header.module.css";

const data = [
  { name: "Abuja outlet", value: 700 },
  { name: "Agege outlet", value: 600 },
  { name: "Ajah outlet", value: 800 },
  { name: "Ibadan outlet", value: 500 },
  { name: "Ikeja outlet", value: 750 },
  { name: "Ikoyi outlet", value: 900 },
  { name: "Ikorodu outlet", value: 550 },
  { name: "Shomolu outlet", value: 700 },
  { name: "Surulere outlet", value: 750 },
  { name: "VI outlet", value: 850 },
];

const BBB = () => {
  const colors = [
    "#ff0000",
    "#00bfff",
    "#ffa500",
    "#a0522d",
    "#ff69b4",
    "#ff00ff",
    "#32cd32",
    "#0000ff",
    "#ba55d3",
    "#ff8c00",
  ];

  const CustomBarShape = (props: any) => {
    const { x, y, width, height, index } = props;
    return (
      <Rectangle x={x} y={y} width={width} height={height} fill={colors[index % colors.length]} />
    );
  };

  return (
    <div className="border border-[#C7C6CF] bg-white p-6 rounded-2xl mb-12">
      <div className={clsx("flex justify-between items-center w-full mb-9")}>
        <h5 className={clsx(styles.salesRevenue)}>Breakdown by Branches</h5>
      </div>
      <div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart width={600} height={300} data={data}>
            <CartesianGrid horizontal={true} vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#000"
              tick={{ fontSize: 12 }} // Adjust font size
              tickMargin={10} // Adjust space between tick labels and axis
            />
            <YAxis stroke="#000" />
            <Tooltip />
            <Bar dataKey="value" shape={CustomBarShape} barSize={30} /> {/* Adjust bar size */}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="ml-[80px] flex justify-start items-center w-full mt-6 gap-2">
        <h5>₦ 10,500,000</h5>
        <p className="text-red-500">-1.5%</p>
        <img src={ArrowDown} alt="arrow-down" />
      </div>
    </div>
  );
};

export default BBB;
