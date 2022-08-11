import * as React from "react";
import useTranslation from "../context/Localization/useTranslation";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer>
      <div className="container">
        <div className="row justify-content-center align-self-center">
          <p>
            <a className="p-3" href="https://tifi.net/about/terms-of-use.html">
              {t("Term of Use")}
            </a>
            <a
              className="p-3"
              href="https://tifi.net/about/privacy-policy.html"
            >
              {t("Privacy Policy")}
            </a>
            <a className="p-3" href="https://tifi.net/about/cookie-policy.html">
              {t("Cookies Policy")}
            </a>
            <a className="p-3" href="https://tifi.net/about/disclaimer.html">
              {t("Disclaimer")}
            </a>
            <a className="p-3" href="https://tifi.net/about/faq.html">
              {t("FAQ")}
            </a>
            <a className="p-3" href="https://tifi.net/about/contact.html">
              {t("Contact Us")}
            </a>
          </p>
        </div>
        <div className="row">
          <div className="col-md-12">
            <p>
              © 2022 <a href="https://tifi.net">TiFi L.L.C.</a>{" "}
              {t("All rights reserved.")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
