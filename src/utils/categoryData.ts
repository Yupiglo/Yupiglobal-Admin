type Category = {
    category: string;
    subCategories: string[];
  };
  
  const categories: Category[] = [
    {
      category: "Change In status",
      subCategories: [
        "Minor to Major",
        "NRI to Resident",
        "Resident To NRI",
      ],
    },
    {
      category: "Change in the Name of the Holder",
      subCategories: [
        "For Corporates",
        "Individuals: Due to Marriage/Divorce",
        "Individuals: Mismatch",
        "Individuals: Other than Marriage/Divorce",
        "Name Deletion",
      ],
    },
    {
      category: "Claim from Unclaimed Suspense Account & Suspense Escrow Demat Account",
      subCategories: [
        "Suspense ESCROW Demat Account",
        "Unclaimed Suspense Account",
      ],
    },
    {
      category: "Consolidation of securities certificate",
      subCategories: [],
    },
    {
      category: "Consolidation/Sub-division / Splitting of securities certificate",
      subCategories: [],
    },
    {
      category: "Demat",
      subCategories: ["Demat", "Remat"],
    },
    {
      category: "Dividend",
      subCategories: [],
    },
    {
      category: "Duplicate Issue",
      subCategories: [
        "Market value of Securities above 5 Lakh",
        "Market value of Securities below 5 Lakh",
      ],
    },
    {
      category: "Endorsement",
      subCategories: [],
    },
    {
      category: "Interest/Redemption",
      subCategories: [],
    },
    {
      category: "Intimation of corporate benefits & other corporate communication AGM / E-Voting / Dividend / Bonus / Stock split",
      subCategories: [],
    },
    {
      category: "Replacement / Renewal / Exchange of securities certificate",
      subCategories: [],
    },
    {
      category: "Request for updation of Investor Details",
      subCategories: [
        "Change of Address",
        "Change in Bank Details",
        "Contact Details",
        "Pan Updation",
      ],
    },
    {
      category: "Tax Exemption",
      subCategories: [
        "Resident Individual",
        "Senior Citizen (Above 60 years of age)",
      ],
    },
    {
      category: "Transmission",
      subCategories: [
        "Nominee not Registered",
        "Nominee registered market value of securities above 5 lakh",
        "Nominee registered market value of securities below 5 lakh",
      ],
    },
    {
      category: "Transposition",
      subCategories: [],
    },
    {
      category: "Others",
      subCategories: [],
    }
  ];
  
  
  export default categories;
  