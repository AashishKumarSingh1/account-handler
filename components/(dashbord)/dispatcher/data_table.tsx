"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  Search,
  Printer,
  // Trash2,
  // Edit,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";
import { formatDateWithSuffix } from "@/lib/date";

interface IDispatch {
  _id: string;
  partnerId: string;
  partnerName?: string;
  articleName?: string;
  quantity: number;
  kg: number;
  average: number;
  numberOfBags?: number;
  updatedAt?: Date;
  createdAt?: Date;
}

interface IPartnerList {
  partnerName: string;
}

interface IArticleList {
  articleName: string;
}

const TABLE_COLUMNS = [
  { key: "updatedAt", label: "Date" },
  { key: "partnerName", label: "Partner" },
  { key: "articleName", label: "Article" },
  { key: "quantity", label: "Quantity" },
  { key: "kg", label: "Weight (kg)" },
  { key: "numberOfBags", label: "Bags" },
  // { label: "Actions" },
] as const;

const PDF_STYLES = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: { flexDirection: "row" },
  tableColHeader: {
    width: "14%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  tableCol: {
    width: "14%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  header: { fontSize: 18, marginBottom: 10 },
});

const DispatchReport = ({ dispatches }: { dispatches: IDispatch[] }) => (
  <Document>
    <Page size="A4" style={PDF_STYLES.page}>
      <Text style={PDF_STYLES.header}>Dispatch Report</Text>
      <View style={PDF_STYLES.table}>
        <View style={PDF_STYLES.tableRow}>
          {TABLE_COLUMNS.slice(0, 6).map(({ label }, index) => (
            <Text key={index} style={PDF_STYLES.tableColHeader}>
              {label}
            </Text>
          ))}
        </View>
        {dispatches.map((dispatch) => (
          <View key={dispatch._id} style={PDF_STYLES.tableRow}>
            <Text style={PDF_STYLES.tableCol}>
              {formatDateWithSuffix(dispatch.createdAt)}
            </Text>
            <Text style={PDF_STYLES.tableCol}>
              {dispatch.partnerName || "N/A"}
            </Text>
            <Text style={PDF_STYLES.tableCol}>
              {dispatch.articleName || "N/A"}
            </Text>
            <Text style={PDF_STYLES.tableCol}>{dispatch.quantity}</Text>
            <Text style={PDF_STYLES.tableCol}>{dispatch.kg}</Text>
            <Text style={PDF_STYLES.tableCol}>
              {dispatch.numberOfBags ?? "N/A"}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

function DataTable({ dispatches }: { dispatches: IDispatch[] }) {
  const [selectedPartner, setSelectedPartner] = useState<string>("");
  const [selectedArticle, setSelectedArticle] = useState<string>("");
  const [partnersList, setPartnersList] = useState<string[]>([]);
  const [articlesList, setArticlesList] = useState<string[]>([]);
  const [partnerDropdownOpen, setPartnerDropdownOpen] = useState(false);
  const [articleDropdownOpen, setArticleDropdownOpen] = useState(false);
  const [partnerSearchInput, setPartnerSearchInput] = useState("");
  const [articleSearchInput, setArticleSearchInput] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof IDispatch;
    direction: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [partnersRes, articlesRes] = await Promise.all([
          fetch("/api/partner?type=partner"),
          fetch("/api/partner?type=article"),
        ]);

        if (!partnersRes.ok || !articlesRes.ok) {
          throw new Error("Failed to fetch dropdown data");
        }

        const partnersJson = await partnersRes.json();
        const articlesJson = await articlesRes.json();

        setPartnersList(
          partnersJson.partners.map((p: IPartnerList) => p.partnerName).sort()
        );
        setArticlesList(
          articlesJson.articles.map((a: IArticleList) => a.articleName).sort()
        );
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  const filteredPartners = useMemo(() => {
    return partnersList.filter((partner) =>
      partner.toLowerCase().includes(partnerSearchInput.toLowerCase())
    );
  }, [partnersList, partnerSearchInput]);

  const filteredArticles = useMemo(() => {
    return articlesList.filter((article) =>
      article.toLowerCase().includes(articleSearchInput.toLowerCase())
    );
  }, [articlesList, articleSearchInput]);

  const filteredDispatches = useMemo(() => {
    return dispatches.filter((dispatch) => {
      const partnerMatch = selectedPartner
        ? dispatch.partnerName === selectedPartner
        : true;
      const articleMatch = selectedArticle
        ? dispatch.articleName === selectedArticle
        : true;
      return partnerMatch && articleMatch;
    });
  }, [dispatches, selectedPartner, selectedArticle]);

  const sortedDispatches = useMemo(() => {
    if (!sortConfig) return filteredDispatches;

    return [...filteredDispatches].sort((a, b) => {
      const aValue = a[sortConfig.key] ?? "";
      const bValue = b[sortConfig.key] ?? "";

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredDispatches, sortConfig]);

  const handleSort = useCallback((key: keyof IDispatch) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  }, []);

  const handlePartnerSelect = useCallback((partner: string) => {
    setSelectedPartner(partner);
    setPartnerDropdownOpen(false);
    setPartnerSearchInput("");
  }, []);

  const handleArticleSelect = useCallback((article: string) => {
    setSelectedArticle(article);
    setArticleDropdownOpen(false);
    setArticleSearchInput("");
  }, []);

  const togglePartnerDropdown = useCallback(() => {
    setPartnerDropdownOpen((prev) => !prev);
    if (partnerDropdownOpen) setPartnerSearchInput("");
  }, [partnerDropdownOpen]);

  const toggleArticleDropdown = useCallback(() => {
    setArticleDropdownOpen((prev) => !prev);
    if (articleDropdownOpen) setArticleSearchInput("");
  }, [articleDropdownOpen]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold">Dispatch Records</h2>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <button
              type="button"
              className="w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-md bg-white shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={togglePartnerDropdown}
            >
              {selectedPartner || "Select Partner"}
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {partnerDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                <div className="px-2 py-1 sticky top-0 bg-white">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search partners..."
                    className="w-full pl-10 pr-3 py-2 border-b border-gray-200 focus:outline-none focus:border-blue-500"
                    value={partnerSearchInput}
                    onChange={(e) => setPartnerSearchInput(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <ul>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handlePartnerSelect("")}
                  >
                    All Partners
                  </li>
                  {filteredPartners.map((partner) => (
                    <li
                      key={partner}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handlePartnerSelect(partner)}
                    >
                      {partner}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="relative w-full md:w-64">
            <button
              type="button"
              className="w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-md bg-white shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={toggleArticleDropdown}
            >
              {selectedArticle || "Select Article"}
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {articleDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                <div className="px-2 py-1 sticky top-0 bg-white">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full pl-10 pr-3 py-2 border-b border-gray-200 focus:outline-none focus:border-blue-500"
                    value={articleSearchInput}
                    onChange={(e) => setArticleSearchInput(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <ul>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleArticleSelect("")}
                  >
                    All Articles
                  </li>
                  {filteredArticles.map((article) => (
                    <li
                      key={article}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleArticleSelect(article)}
                    >
                      {article}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {!partnerDropdownOpen && !articleDropdownOpen && (
            <PDFDownloadLink
              document={<DispatchReport dispatches={filteredDispatches} />}
              fileName="dispatch_report.pdf"
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center"
            >
              <Printer className="inline mr-2" size={16} />
              Export PDF
            </PDFDownloadLink>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {TABLE_COLUMNS.map(({ key, label }) => (
                <th
                  key={key || label}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div
                    className={`flex items-center gap-1 ${
                      key ? "cursor-pointer hover:text-gray-700" : ""
                    }`}
                    onClick={() => key && handleSort(key)}
                  >
                    {label}
                    {key && <ArrowUpDown className="w-4 h-4 opacity-50" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedDispatches.length > 0 ? (
              sortedDispatches.map((dispatch) => (
                <tr key={dispatch._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateWithSuffix(dispatch.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {dispatch.partnerName || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dispatch.articleName || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dispatch.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dispatch.kg}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dispatch.numberOfBags ?? "N/A"}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={TABLE_COLUMNS.length}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {selectedPartner || selectedArticle
                    ? "No matching records found"
                    : "No dispatch records available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
