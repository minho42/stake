import { useContext, useState, useEffect } from "react";
import { PortfolioContext } from "../PortfolioContext";
import { LoadingIcon } from "./LoadingIcon";
import { PieChart, Pie, Cell } from "recharts";
import { showValueWithComma } from "../utils";

export const PortfolioInfoPieChart = ({}) => {
  const [data, setData] = useState([]);
  const { portfolioInfo, totalValue, setTotalValue } = useContext(PortfolioContext);
  const colors = ["#00C49F", "#0088FE", "#FFBB28", "#FF8042"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent, index }) => {
    if (percent < 1) {
      return null;
    }
    const radius = innerRadius + (outerRadius - innerRadius) * 0.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="0.8rem"
      >
        {`${name}: ${percent}%`}
      </text>
    );
  };

  useEffect(() => {
    const tempData = [];
    portfolioInfo.forEach((p) => {
      tempData.push({ ...p, percent: Number.parseFloat(((p.value / totalValue) * 100).toFixed(1)) });
    });
    setData(tempData);
  }, [portfolioInfo, totalValue]);

  useEffect(() => {
    let total = 0;
    portfolioInfo.forEach((p) => {
      total += p.value;
    });
    setTotalValue(total);
  }, [JSON.stringify(portfolioInfo)]);

  if (!portfolioInfo) {
    return (
      <div className="flex items-center justify-center bg-white rounded-xl">portfolioInfo not available</div>
    );
  }

  if (totalValue <= 0) {
    return (
      <div className="flex items-center justify-center">
        <LoadingIcon />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-gray-300">
      <div className="flex justify-between space-x-2">
        <PieChart width={180} height={180}>
          <text x={90} y={90} textAnchor="middle" dominantBaseline="middle" fontSize="30" fontWeight="300">
            ${showValueWithComma(totalValue, true)}
          </text>
          <Pie
            strokeWidth="2"
            data={data}
            cx="50%"
            cy="50%"
            // labelLine={false}
            // label={renderCustomizedLabel}
            innerRadius={60}
            outerRadius={80}
            fill="#10b882"
            dataKey="percent"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </PieChart>
        <div className="flex flex-col justify-center  divide-y space-y-2">
          {data.map((d) => {
            return (
              <div key={d.label[0]} className="flex justify-between text-2xl font-light">
                <div>{d.label[0]}:</div>
                <div>{d.percent}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
