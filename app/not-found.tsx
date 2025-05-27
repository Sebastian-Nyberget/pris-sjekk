import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container py-8 flex flex-col items-center w-full max-w-full justify-center">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">404 - Side ikke funnet</h2>
        <p className="mb-6">
          Siden du leter etter eksisterer ikke eller har blitt fjernet.
        </p>
        <Link href="/">
          <Button>Tilbkae</Button>
        </Link>
      </div>
    </div>
  );
}
