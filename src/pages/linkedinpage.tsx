import { useEffect } from "react";

export default function LinkedInBadge() {
  useEffect(() => {
    // Load LinkedIn script once
    const script = document.createElement("script");
    script.src = "https://platform.linkedin.com/badges/js/profile.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup if component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="badge-base LI-profile-badge"
      data-locale="en_US"
      data-size="medium"
      data-theme="dark"
      data-type="VERTICAL"
      data-vanity="sampatakumar-sv"
      data-version="v1"
    >
      <a
        className="badge-base__link LI-simple-link"
        href="https://in.linkedin.com/in/sampatakumar-sv?trk=profile-badge"
        target="_blank"
        rel="noopener noreferrer"
      >
        Sampatakumar S V
      </a>
    </div>
  );
}

