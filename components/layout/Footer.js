export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Clipboard Manager. All rights reserved.
          </p>
          <p className="mt-1">Secure cross-device clipboard synchronization</p>
        </div>
      </div>
    </footer>
  );
}
