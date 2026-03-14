import { getFooterWidgets } from "@/lib/wordpress";
import WPWidgetArea from "./WPWidgetArea";

async function Footer() {
  const footerData = await getFooterWidgets();

  return (
    <>
      {footerData?.length && (
        <WPWidgetArea sidebar="footer" widgets={footerData} />
      )}
      <footer className="mt-auto bg-gray-800 py-4 text-white">
        <div className="container mx-auto text-center">
          <p>
            &copy; {new Date().getFullYear()} VillageInfo. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
