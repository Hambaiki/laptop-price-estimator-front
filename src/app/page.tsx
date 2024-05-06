import LaptopSelector from "@/components/LaptopSelector";

async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 lg:p-24">
      <header className="w-full">
        <h1 className="text-4xl font-bold">Laptop Price Estimator</h1>
        <p className="text-gray-500 mt-2">
          Estimate your laptop budget based on your desired specifications.
        </p>
      </header>

      <article className="mt-8 w-full">
        <h2 className="text-xl font-semibold">How does it work?</h2>
        <p className="mt-2 text-gray-700">
          Simply input the desired specification and the input will be
          processed. The results will include predictions generated the trained
          machine learning model. machine learning model
        </p>
        <p className="mt-2 text-gray-400 text-sm">
          <strong>Note: </strong>The model is trained from a dataset with INR
          currency. The estimated price is converted from INR to USD at the
          current rate of 0.012 as of{" "}
          {new Date("2024/5/5").toLocaleDateString()}
        </p>
      </article>

      <section className="mt-8 w-full">
        <LaptopSelector />
      </section>

      <footer className="text-gray-500 text-sm mt-8">
        <p>
          <span className="font-semibold">LPA Model Implementation</span> |
          Developed by
          <span className="font-semibold"> PWK.</span>
        </p>
      </footer>
    </main>
  );
}

export default Home;
