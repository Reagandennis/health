import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Graphs = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Our Service',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.1,
        fill: false,
      },
      {
        label: 'Competitor A',
        data: [45, 60, 70, 78, 50, 53],
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
        fill: false,
      },
    ],
  };

  return (
    <section id="graphs" className="py-20 bg-gray-900 px-8">
      <h2 className="text-3xl font-bold text-center text-white">Performance Comparison</h2>
      <div className="mt-8">
        <Line data={data} />
      </div>
    </section>
  );
};

export default Graphs;
