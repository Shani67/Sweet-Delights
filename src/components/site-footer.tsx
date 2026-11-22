export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-blush bg-white">
      <div className="container-page flex flex-col gap-2 py-8 text-sm text-cocoa-soft sm:flex-row sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Sweet Delights. Handmade in Colombo.</p>
        <p>
          A portfolio project by{" "}
          <a className="font-medium text-rose-ink underline" href="https://github.com/Shani67">
            Geethma Ranathunga
          </a>
        </p>
      </div>
    </footer>
  );
}
