import Link from "next/link";
import Image from "next/image";

export default function WandrFooter() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <Link href="/" className="inline-flex items-center mb-3">
              <Image
                src="/Wandr_logo.png"
                alt="Wandr"
                width={100}
                height={41}
                className="h-8"
                style={{ width: "auto" }}
              />
            </Link>
            <p>
              Budget-first travel, built on a native fintech engine. One number
              — your total budget — unlocks every trip you can actually take.
            </p>
            <div
              className="wd-mono"
              style={{ fontSize: "12px", color: "var(--w-ink-light)" }}
            >
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--w-accent)",
                    display: "inline-block",
                  }}
                />
                All systems live · FX refreshing
              </span>
            </div>
          </div>

          <div className="footer-col">
            <h5>Product</h5>
            <ul>
              <li><Link href="/plan">Plan a trip</Link></li>
              <li><Link href="/explore">Explore</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/guides">Guides</Link></li>
              <li><Link href="#">Press</Link></li>
              <li><Link href="#">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Legal</h5>
            <ul>
              <li><Link href="#">Terms</Link></li>
              <li><Link href="#">Privacy</Link></li>
              <li><Link href="#">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bot">
          <span>© 2026 Wandr Financial, Inc.</span>
          <span>Made for travelers who do the math.</span>
        </div>
      </div>
    </footer>
  );
}
