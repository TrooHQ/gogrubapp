import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";

const size = {
  width: 400,
  height: 300,
};

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 20,
}));

const StyledTotalRevenue = styled(StyledText)({
  fill: "#858497",
  fontSize: "18px",
  fontWeight: 400,
  lineHeight: "27px",
});

const StyledSum = styled(StyledText)({
  fill: "#201F44",
  fontSize: "40px",
  fontWeight: 600,
  lineHeight: "54px",
});

function formatNumber(num: number): string {
  console.log(num, "num");
  if (num < 1000) {
    return num.toString(); // Show full number for values below 1000
  } else if (num >= 1000 && num < 1000000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K"; // Show as 'K' for thousands
  } else if (num >= 1000000 && num < 1000000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M"; // Show as 'M' for millions
  } else if (num >= 1000000000 && num < 1000000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B"; // Show as 'B' for billions
  } else {
    return (num / 1000000000000).toFixed(1).replace(/\.0$/, "") + "T"; // Show as 'T' for trillions
  }
}

function PieCenterLabel({ total }: { total: number }) {
  const { width, height, left, top } = useDrawingArea();
  const formattedSum = formatNumber(total);

  return (
    <>
      <StyledTotalRevenue x={left + width / 2} y={top + height / 2 - 20}>
        Total Revenue
      </StyledTotalRevenue>
      <StyledSum x={left + width / 2} y={top + height / 2 + 20}>
        ₦{formattedSum}
      </StyledSum>
    </>
  );
}

const PieCharts = ({ topMenuItems }: { topMenuItems: any[] }) => {
  const totalValue = topMenuItems.reduce((sum, item) => sum + item.totalRevenue, 0);

  // Map the data to include percentages
  const data = topMenuItems.map((item, index) => ({
    value: parseFloat(((item.totalRevenue / totalValue) * 100).toFixed(2)),
    // label: `${item.menuItemName}: ${((item.totalRevenue / totalValue) * 100).toFixed(2)}%`, // Add `%` to the label
    color: [
      "#9787FF",
      "#FFA5DA",
      "#0096FF",
      "#5BD222",
      "#FDB600",
      "#FF5733",
      "#33FF57",
      "#3357FF",
      "#FF33A5",
      "#A533FF",
    ][index % 10],
  }));

  const total = topMenuItems.reduce((sum, item) => sum + item.totalRevenue, 0);

  return (
    <PieChart
      series={[
        {
          data,
          innerRadius: 125,
        },
      ]}
      {...size}
      tooltip={{
        trigger: "item",
      }}
    >
      <PieCenterLabel total={total} />
    </PieChart>
  );
};

export default PieCharts;
