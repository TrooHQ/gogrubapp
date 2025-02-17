import { ArrowOutwardDownIcon } from "../../components/svgs";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
} from "recharts";
import ArrowDown from "../../assets/ArrowDown.svg";

const data = [
  { name: "8AM", uv: 4000, "Sales Revenue": 2400, amt: 2400 },
  { name: "9AM", uv: 3000, "Sales Revenue": 1398, amt: 2210 },
  { name: "10AM", uv: 2000, "Sales Revenue": 3800, amt: 2290 },
  { name: "11AM", uv: 2000, "Sales Revenue": 2800, amt: 2290 },
  { name: "12PM", uv: 2000, "Sales Revenue": 4800, amt: 2290 },
  { name: "1PM", uv: 2000, "Sales Revenue": 3800, amt: 2290 },
  { name: "2PM", uv: 2000, "Sales Revenue": 1800, amt: 2290 },
  { name: "3PM", uv: 2000, "Sales Revenue": 2200, amt: 2290 },
  { name: "4PM", uv: 2000, "Sales Revenue": 3000, amt: 2290 },
  { name: "5PM", uv: 2000, "Sales Revenue": 4400, amt: 2290 },
  { name: "6PM", uv: 2000, "Sales Revenue": 5800, amt: 2290 },
  { name: "7PM", uv: 2000, "Sales Revenue": 6800, amt: 2290 },
];

const CustomLabel = () => (
  <div>
    <ArrowOutwardDownIcon />
    <span>
      ₦ 10,500,000 <ArrowOutwardDownIcon />
    </span>
  </div>
);

const Recharts = () => {
  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          {/* <XAxis dataKey="name" /> */}
          <XAxis dataKey="name">
            <Label content={<CustomLabel />} position="insideBottomRight" offset={10} />{" "}
          </XAxis>
          <YAxis
            orientation="left"
            stroke="#494953"
            label={{ value: "Quantity", angle: -90, position: "insideLeft" }}
          />
          <YAxis orientation="right" stroke="#5855B3" />
          <Tooltip />
          <Bar dataKey="Sales Revenue" fill="#5855B3" barSize={20} />{" "}
        </BarChart>
      </ResponsiveContainer>
      <div className="ml-[100px] flex justify-start items-center w-full mt-6 gap-2">
        <h5>₦ 10,500,000</h5>
        <p className="text-red-500">-1.5%</p>
        <img src={ArrowDown} alt="arrow-down" />
      </div>
    </div>
  );
};

export default Recharts;
