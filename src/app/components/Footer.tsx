import React from "react";
import styles from "@/app/styles/footer.module.scss";

function Footer() {

  return (
    <div className={styles.banner}>
    <div>MUMUS</div>
    <div>
      <p>이용약관 l 개인정보처리방침</p>
      <p>CEO : 그린</p>
      <p>H.P : 070-3232-3232</p>
      <p>FAX : +82-02-3232-3233</p>
      <p>ADDRESS : 대전광역시 서구 대덕대로</p>
      <p>ⓒ 2023 MK. All rights reserved</p>
    </div>
  </div>
  );
}

export default Footer;
