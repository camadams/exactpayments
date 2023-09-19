// Import necessary modules and functions
import { GetServerSideProps } from "next";
import { api } from "~/utils/api";

// Define the component's props interface
interface YourComponentProps {
  data: any; // Replace 'any' with the actual type of your data
}

// Your component
function YourComponent({ data }: YourComponentProps) {
  // Use the fetched data in your component
  return <div>{data}</div>;
}

// Implement getServerSideProps function
export const getServerSideProps: GetServerSideProps<YourComponentProps> = async (context) => {
  // Fetch data from the API based on the context or any other parameters
  const data = await fetch("http://localhost:3000/api/test").then((x) => console.log("*********", x));
  // .then((y) => console.log("*********", y));
  return {
    props: { data },
  };
};

export default YourComponent;
