import Image from "next/image";
export default function Custom404() {
  return (
    <div className=" bg-slate-900 flex h-screen ">
      <div className=" m-auto text-center  ">
        <Image
          src="/grid.svg"
          height={300}
          width={400}
          className="mx-auto animate-pulse "
        />
        <div className="border-b-2 border-yellow-400 my-6" />
        <h1 className="text-white text-2xl">404 - Page not found.</h1>
      </div>
    </div>
  );
}
