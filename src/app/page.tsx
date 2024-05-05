import LaptopSelector from "@/components/LaptopSelector";

async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full">
        <h1 className="text-4xl font-bold">Laptop Price Estimator</h1>
        <p className="text-gray-500 mt-2">
          Powered by a machine learning model
        </p>
      </div>

      <div className="mt-8 w-full">
        <LaptopSelector />
      </div>

      {/* <div className="mt-8 w-full">
        <h2 className="text-xl font-semibold">Introduction</h2>
        <p className="mt-2">something</p>
        <p className="mt-2">something</p>
      </div> */}
    </main>
  );
}

export default Home;
