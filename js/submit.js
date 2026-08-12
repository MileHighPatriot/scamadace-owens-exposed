/* Claim submission — requires evidence links; opens X intent + local draft */
(function () {
  const form = document.getElementById("submit-form");
  const out = document.getElementById("submit-output");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = new FormData(form);
    const claim = (data.get("claim") || "").trim();
    const date = (data.get("date") || "").trim();
    const platform = (data.get("platform") || "").trim();
    const primary = (data.get("primary") || "").trim();
    const timestamp = (data.get("timestamp") || "").trim();
    const quote = (data.get("quote") || "").trim();
    const related = (data.get("related") || "").trim();
    const notes = (data.get("notes") || "").trim();
    const submitter = (data.get("submitter") || "").trim();

    if (!claim || !primary || !date) {
      alert("Claim, date, and at least one primary evidence link are required.");
      return;
    }

    if (!/https?:\/\//i.test(primary)) {
      alert(
        "Primary evidence must include at least one http(s) link to Owens’s own words (X post, show clip, etc.). Opinion-only submissions are rejected."
      );
      return;
    }

    const body =
      "NEW CLAIM SUBMISSION — Scamdace Owens Exposed\n" +
      "Intake: date | platform | url | timestamp | exactQuote | claimThesis | relatedClaimIds\n\n" +
      "Claim thesis: " +
      claim +
      "\n" +
      "Date: " +
      date +
      "\n" +
      "Platform: " +
      (platform || "n/a") +
      "\n" +
      "Timestamp / show clock: " +
      (timestamp || "n/a") +
      "\n" +
      "Exact quote: " +
      (quote || "n/a") +
      "\n" +
      "Related claim IDs: " +
      (related || "n/a") +
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

    const tweet =
      "Claim submission for Scamdace Owens Exposed:\n\n" +
      claim.slice(0, 160) +
      (claim.length > 160 ? "…" : "") +
      "\n" +
      date +
      (timestamp ? " · " + timestamp : "") +
      "\nSources: " +
      primary.split("\n")[0].slice(0, 90);
    const xUrl =
      "https://x.com/intent/tweet?text=" +
      encodeURIComponent(tweet + "\n\ncc @America1st5280");
    window.open(xUrl, "_blank", "noopener");

    if (window.SOE && SOE.copyText) {
      SOE.copyText(body, document.getElementById("copy-submission"));
    }
  });

  var copyBtn = document.getElementById("copy-submission");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      const data = new FormData(form);
      const draft =
        "Claim: " +
        (data.get("claim") || "") +
        "\nDate: " +
        (data.get("date") || "") +
        "\nPrimary:\n" +
        (data.get("primary") || "");
      if (window.SOE && SOE.copyText) SOE.copyText(draft, copyBtn);
    });
  }
})();
