/* Claim submission — requires evidence links; opens X DM intent + mailto + local draft */
(function () {
  const form = document.getElementById("submit-form");
  const out = document.getElementById("submit-output");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = new FormData(form);
    const claim = (data.get("claim") || "").trim();
    const date = (data.get("date") || "").trim();
    const primary = (data.get("primary") || "").trim();
    const notes = (data.get("notes") || "").trim();
    const submitter = (data.get("submitter") || "").trim();

    if (!claim || !primary) {
      alert("Claim summary and at least one primary evidence link are required.");
      return;
    }

    // Reject pure opinion: require URL-looking primary evidence
    if (!/https?:\/\//i.test(primary)) {
      alert(
        "Primary evidence must include at least one http(s) link to Owens’s own words (X post, show clip, etc.). Opinion-only submissions are rejected."
      );
      return;
    }

    const body =
      "NEW CLAIM SUBMISSION — Scamdace Owens Exposed\n\n" +
      "Claim: " +
      claim +
      "\n" +
      "Approx date: " +
      (date || "n/a") +
      "\n" +
      "Primary evidence links:\n" +
      primary +
      "\n\n" +
      "Notes:\n" +
      (notes || "n/a") +
      "\n\n" +
      "Submitter: " +
      (submitter || "anonymous") +
      "\n";

    if (out) {
      out.hidden = false;
      out.textContent = body;
    }

    // Prefer X intent to author
    const tweet =
      "Claim submission for Scamdace Owens Exposed:\n\n" +
      claim.slice(0, 180) +
      (claim.length > 180 ? "…" : "") +
      "\n\nSources: " +
      primary.split("\n")[0].slice(0, 100);
    const xUrl =
      "https://x.com/intent/tweet?text=" +
      encodeURIComponent(tweet + "\n\ncc @America1st5280");
    window.open(xUrl, "_blank", "noopener");

    SOE.copyText(body, document.getElementById("copy-submission"));
  });
})();
