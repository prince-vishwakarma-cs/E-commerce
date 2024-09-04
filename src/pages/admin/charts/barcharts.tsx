import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { BarChart } from "../../../components/admin/Charts";
import { RootState } from "../../../redux/store";
import { useBarQuery } from "../../../redux/api/dashboardAPI";
import { customError } from "../../../types/api-types";
import toast from "react-hot-toast";
import Loader from "../../../components/Loader";
import { getLastMonths } from "../../../utils/features";

const { last6Months, last12Months } = getLastMonths();

const Barcharts = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  console.log(user?._id);
  const { isLoading, data, error, isError } = useBarQuery(user?._id!);

  const products = data?.charts.products || [];
  const users = data?.charts.users || [];
  const orders = data?.charts.orders || [];

  if (isError) {
    const err = error as customError;
    toast.error(err.data.message);
  }
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <h1>Bar Charts</h1>
            <section>
              <BarChart
                data_2={products}
                data_1={users}
                labels={last6Months}
                title_1="Products"
                title_2="Users"
                bgColor_1={`hsl(260, 50%, 30%)`}
                bgColor_2={`hsl(360, 90%, 90%)`}
              />
              <h2>Top Products & Top Customers</h2>
            </section>

            <section>
              <BarChart
                horizontal={true}
                data_1={orders}
                data_2={[]}
                title_1="Orders"
                title_2=""
                bgColor_1={`hsl(180, 40%, 50%)`}
                bgColor_2=""
                labels={last12Months}
              />
              <h2>Orders throughout the year</h2>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Barcharts;
