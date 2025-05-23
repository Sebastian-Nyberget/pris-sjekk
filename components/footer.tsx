export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-0 flex flex-col items-center">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © 2025 PrisSjekk. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          <a href="#" className="hover:underline">
            Personvernerklæring
          </a>
          <a href="#" className="hover:underline">
            Kontakt
          </a>
        </div>
      </div>
    </footer>
  );
}
