import DesignBoard from "@/components/DesignBoard";

export const metadata = {
  title: "Design Canvas",
  description: "Select a shape and place it on the canvas",
};

export default function Page() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-semibold">Design Canvas</h1>
      <p className="mt-1 text-ui-grey-600">
        Choose a shape and click on the canvas to place it.
      </p>
      <div className="mt-6">
        <DesignBoard />
      </div>
    </section>
  );
}
