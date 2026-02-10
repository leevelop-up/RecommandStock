import { useState, useEffect } from "react";
import {
  Database,
  RefreshCw,
  Calendar,
  TrendingUp,
  BarChart3,
  Clock,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from "lucide-react";

interface DataFile {
  filename: string;
  filepath: string;
  fileType: "recommendation" | "growth";
  fileSize: number;
  fileSizeFormatted: string;
  modifiedAt: string;
  generatedAt: string;
  engine: string;
  stockCount?: {
    korea: number;
    usa: number;
    total: number;
  };
  topPicksCount?: number;
  sectorsCount?: number;
  themesCount?: number;
  marketSentiment?: string;
  marketTrend?: string;
}

interface FileDetail {
  recommendations?: {
    korea: any[];
    usa: any[];
  };
  top_picks?: any[];
  sector_analysis?: any[];
  market_overview?: any;
  korea_picks?: any[];
  usa_picks?: any[];
  theme_picks?: any[];
}

interface FileListResponse {
  files: DataFile[];
  totalCount: number;
  outputDir: string;
}

export default function DataManagementPage() {
  const [dataFiles, setDataFiles] = useState<DataFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const [fileDetails, setFileDetails] = useState<Record<string, FileDetail>>({});
  const [loadingDetails, setLoadingDetails] = useState<Set<string>>(new Set());
  const [outputDir, setOutputDir] = useState("");

  useEffect(() => {
    loadDataFiles();
  }, []);

  const loadDataFiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8000/api/data-files/list");

      if (!response.ok) {
        throw new Error("데이터 파일 목록을 불러올 수 없습니다");
      }

      const data: FileListResponse = await response.json();
      setDataFiles(data.files);
      setOutputDir(data.outputDir);
    } catch (err) {
      console.error("데이터 파일 로드 실패:", err);
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = async (filename: string) => {
    const newExpanded = new Set(expandedFiles);

    if (newExpanded.has(filename)) {
      // 접기
      newExpanded.delete(filename);
    } else {
      // 펼치기 - 세부 내용 로드
      newExpanded.add(filename);

      // 아직 로드 안 된 경우만 API 호출
      if (!fileDetails[filename]) {
        setLoadingDetails(new Set([...loadingDetails, filename]));

        try {
          const response = await fetch(
            `http://localhost:8000/api/data-files/detail/${filename}`
          );

          if (response.ok) {
            const detail = await response.json();
            setFileDetails((prev) => ({
              ...prev,
              [filename]: detail,
            }));
          }
        } catch (err) {
          console.error("파일 세부 내용 로드 실패:", err);
        } finally {
          const newLoading = new Set(loadingDetails);
          newLoading.delete(filename);
          setLoadingDetails(newLoading);
        }
      }
    }

    setExpandedFiles(newExpanded);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getTimeSince = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}일 전`;
    if (diffHours > 0) return `${diffHours}시간 전`;
    if (diffMins > 0) return `${diffMins}분 전`;
    return "방금 전";
  };

  const getSentimentColor = (sentiment?: string) => {
    if (!sentiment) return "text-gray-600 bg-gray-50";
    switch (sentiment.toLowerCase()) {
      case "bullish":
      case "positive":
        return "text-green-600 bg-green-50";
      case "bearish":
      case "negative":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getSentimentText = (sentiment?: string) => {
    if (!sentiment) return "중립";
    switch (sentiment.toLowerCase()) {
      case "bullish":
        return "강세장";
      case "bearish":
        return "약세장";
      case "positive":
        return "긍정적";
      case "negative":
        return "부정적";
      default:
        return "중립";
    }
  };

  const getFileTypeText = (type: string) => {
    return type === "recommendation" ? "AI 추천" : "급등 예측";
  };

  const getFileTypeBadgeColor = (type: string) => {
    return type === "recommendation"
      ? "bg-blue-100 text-blue-700"
      : "bg-purple-100 text-purple-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">데이터 파일을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">오류 발생</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadDataFiles}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">데이터 관리</h1>
          </div>
          <p className="text-gray-600 text-lg mb-2">
            생성된 AI 추천 데이터 파일 목록
          </p>
          <p className="text-sm text-gray-500">
            📁 저장 위치: <code className="bg-gray-100 px-2 py-1 rounded">{outputDir}</code>
          </p>
        </div>

        {/* 통계 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">전체 파일</span>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">{dataFiles.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">AI 추천 파일</span>
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              {dataFiles.filter((f) => f.fileType === "recommendation").length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">급등 예측 파일</span>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {dataFiles.filter((f) => f.fileType === "growth").length}
            </p>
          </div>
        </div>

        {/* 파일 목록 */}
        <div className="space-y-4">
          {dataFiles.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                데이터 파일이 없습니다
              </h3>
              <p className="text-gray-600 mb-6">
                아래 명령어로 데이터를 생성해주세요
              </p>
              <code className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-mono text-sm">
                python scheduler.py --once
              </code>
            </div>
          ) : (
            dataFiles.map((file) => (
              <div
                key={file.filename}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-blue-200 transition-all"
              >
                {/* 파일 헤더 */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleExpand(file.filename)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-bold text-gray-900">
                          {file.filename}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getFileTypeBadgeColor(
                            file.fileType
                          )}`}
                        >
                          {getFileTypeText(file.fileType)}
                        </span>
                        {file.marketSentiment && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getSentimentColor(
                              file.marketSentiment
                            )}`}
                          >
                            {getSentimentText(file.marketSentiment)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDateTime(file.modifiedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{getTimeSince(file.modifiedAt)}</span>
                        </div>
                        <div>
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {file.fileSizeFormatted}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs uppercase font-semibold text-blue-600">
                            {file.engine}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      {expandedFiles.has(file.filename) ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 확장된 상세 정보 */}
                {expandedFiles.has(file.filename) && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        데이터 통계
                      </h4>

                      {file.stockCount && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-sm text-blue-600 mb-1">한국 종목</p>
                            <p className="text-2xl font-bold text-blue-700">
                              {file.stockCount.korea}
                            </p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-4">
                            <p className="text-sm text-purple-600 mb-1">
                              미국 종목
                            </p>
                            <p className="text-2xl font-bold text-purple-700">
                              {file.stockCount.usa}
                            </p>
                          </div>
                          {file.topPicksCount !== undefined && (
                            <div className="bg-green-50 rounded-lg p-4">
                              <p className="text-sm text-green-600 mb-1">
                                TOP 추천
                              </p>
                              <p className="text-2xl font-bold text-green-700">
                                {file.topPicksCount}
                              </p>
                            </div>
                          )}
                          {file.sectorsCount !== undefined && (
                            <div className="bg-orange-50 rounded-lg p-4">
                              <p className="text-sm text-orange-600 mb-1">
                                섹터 분석
                              </p>
                              <p className="text-2xl font-bold text-orange-700">
                                {file.sectorsCount}
                              </p>
                            </div>
                          )}
                          {file.themesCount !== undefined && (
                            <div className="bg-pink-50 rounded-lg p-4">
                              <p className="text-sm text-pink-600 mb-1">
                                테마 분석
                              </p>
                              <p className="text-2xl font-bold text-pink-700">
                                {file.themesCount}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 세부 데이터 로딩 중 */}
                      {loadingDetails.has(file.filename) && (
                        <div className="flex items-center justify-center py-8">
                          <RefreshCw className="w-6 h-6 text-blue-500 animate-spin mr-2" />
                          <span className="text-gray-600">세부 내용 불러오는 중...</span>
                        </div>
                      )}

                      {/* AI 추천 파일 세부 내용 */}
                      {!loadingDetails.has(file.filename) &&
                        fileDetails[file.filename] &&
                        file.fileType === "recommendation" && (
                          <div className="space-y-6 mt-6">
                            {/* 시장 개요 */}
                            {fileDetails[file.filename].market_overview && (
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <BarChart3 className="w-4 h-4" />
                                  시장 개요
                                </h5>
                                <p className="text-sm text-gray-700 mb-2">
                                  {fileDetails[file.filename].market_overview?.summary}
                                </p>
                                <div className="flex gap-3 text-xs mt-3">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                    트렌드: {fileDetails[file.filename].market_overview?.trend}
                                  </span>
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                                    심리: {fileDetails[file.filename].market_overview?.sentiment}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* TOP 추천 종목 */}
                            {fileDetails[file.filename].top_picks &&
                              fileDetails[file.filename].top_picks!.length > 0 && (
                                <div className="bg-green-50 rounded-lg p-4">
                                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    TOP 추천 종목 (상위 5개)
                                  </h5>
                                  <div className="space-y-2">
                                    {fileDetails[file.filename]
                                      .top_picks!.slice(0, 5)
                                      .map((pick: any, idx: number) => (
                                        <div
                                          key={idx}
                                          className="flex items-center justify-between bg-white rounded px-3 py-2"
                                        >
                                          <div className="flex items-center gap-3">
                                            <span className="text-lg font-bold text-green-600">
                                              #{pick.rank || idx + 1}
                                            </span>
                                            <div>
                                              <p className="font-semibold text-sm text-gray-900">
                                                {pick.name}
                                              </p>
                                              <p className="text-xs text-gray-500">
                                                {pick.ticker}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-sm font-semibold text-green-600">
                                              점수: {pick.score}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                              {pick.action}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}

                            {/* 섹터 분석 */}
                            {fileDetails[file.filename].sector_analysis &&
                              fileDetails[file.filename].sector_analysis!.length > 0 && (
                                <div className="bg-orange-50 rounded-lg p-4">
                                  <h5 className="font-semibold text-gray-900 mb-3">
                                    섹터 분석
                                  </h5>
                                  <div className="space-y-3">
                                    {fileDetails[file.filename]
                                      .sector_analysis!.slice(0, 5)
                                      .map((sector: any, idx: number) => (
                                        <div
                                          key={idx}
                                          className="bg-white rounded px-3 py-2"
                                        >
                                          <div className="flex items-center justify-between mb-1">
                                            <p className="font-semibold text-sm text-gray-900">
                                              {sector.sector}
                                            </p>
                                            <span
                                              className={`text-xs px-2 py-1 rounded ${
                                                sector.outlook === "positive"
                                                  ? "bg-green-100 text-green-700"
                                                  : sector.outlook === "negative"
                                                  ? "bg-red-100 text-red-700"
                                                  : "bg-gray-100 text-gray-700"
                                              }`}
                                            >
                                              {sector.outlook}
                                            </span>
                                          </div>
                                          <p className="text-xs text-gray-600">
                                            {sector.reasoning}
                                          </p>
                                          {sector.top_stocks && (
                                            <p className="text-xs text-blue-600 mt-1">
                                              대표 종목: {sector.top_stocks.slice(0, 3).join(", ")}
                                            </p>
                                          )}
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        )}

                      {/* 급등 예측 파일 세부 내용 */}
                      {!loadingDetails.has(file.filename) &&
                        fileDetails[file.filename] &&
                        file.fileType === "growth" && (
                          <div className="space-y-6 mt-6">
                            {/* 한국 급등 예측 */}
                            {fileDetails[file.filename].korea_picks &&
                              fileDetails[file.filename].korea_picks!.length > 0 && (
                                <div className="bg-blue-50 rounded-lg p-4">
                                  <h5 className="font-semibold text-gray-900 mb-3">
                                    한국 급등 예측 (상위 5개)
                                  </h5>
                                  <div className="space-y-2">
                                    {fileDetails[file.filename]
                                      .korea_picks!.slice(0, 5)
                                      .map((pick: any, idx: number) => (
                                        <div
                                          key={idx}
                                          className="flex items-center justify-between bg-white rounded px-3 py-2"
                                        >
                                          <div>
                                            <p className="font-semibold text-sm text-gray-900">
                                              {pick.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              {pick.ticker}
                                            </p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-sm font-semibold text-blue-600">
                                              예측: {pick.predicted_return}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                              신뢰도: {pick.confidence}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}

                            {/* 미국 급등 예측 */}
                            {fileDetails[file.filename].usa_picks &&
                              fileDetails[file.filename].usa_picks!.length > 0 && (
                                <div className="bg-purple-50 rounded-lg p-4">
                                  <h5 className="font-semibold text-gray-900 mb-3">
                                    미국 급등 예측 (상위 5개)
                                  </h5>
                                  <div className="space-y-2">
                                    {fileDetails[file.filename]
                                      .usa_picks!.slice(0, 5)
                                      .map((pick: any, idx: number) => (
                                        <div
                                          key={idx}
                                          className="flex items-center justify-between bg-white rounded px-3 py-2"
                                        >
                                          <div>
                                            <p className="font-semibold text-sm text-gray-900">
                                              {pick.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              {pick.ticker}
                                            </p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-sm font-semibold text-purple-600">
                                              예측: {pick.predicted_return}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                              신뢰도: {pick.confidence}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}

                            {/* 테마 급등 예측 */}
                            {fileDetails[file.filename].theme_picks &&
                              fileDetails[file.filename].theme_picks!.length > 0 && (
                                <div className="bg-pink-50 rounded-lg p-4">
                                  <h5 className="font-semibold text-gray-900 mb-3">
                                    테마 급등 예측
                                  </h5>
                                  <div className="space-y-3">
                                    {fileDetails[file.filename]
                                      .theme_picks!.slice(0, 5)
                                      .map((theme: any, idx: number) => (
                                        <div
                                          key={idx}
                                          className="bg-white rounded px-3 py-2"
                                        >
                                          <div className="flex items-center justify-between mb-1">
                                            <p className="font-semibold text-sm text-gray-900">
                                              {theme.theme_name || theme.theme}
                                            </p>
                                            <span className="text-xs px-2 py-1 bg-pink-100 text-pink-700 rounded">
                                              {theme.momentum}
                                            </span>
                                          </div>
                                          <p className="text-xs text-gray-600 mb-2">
                                            {theme.reasoning}
                                          </p>
                                          {theme.top_stocks && (
                                            <p className="text-xs text-blue-600">
                                              대표 종목:{" "}
                                              {Array.isArray(theme.top_stocks)
                                                ? theme.top_stocks.slice(0, 3).map((s: any) =>
                                                    typeof s === 'string' ? s : s.name
                                                  ).join(", ")
                                                : "N/A"}
                                            </p>
                                          )}
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        )}

                      <div className="bg-gray-50 rounded-lg p-4 mt-4">
                        <p className="text-sm text-gray-600 mb-1">파일 경로</p>
                        <code className="text-xs text-gray-800 font-mono break-all">
                          {file.filepath}
                        </code>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* 새로고침 버튼 */}
        <div className="mt-8 text-center">
          <button
            onClick={loadDataFiles}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            <RefreshCw className="w-5 h-5" />
            목록 새로고침
          </button>
        </div>

        {/* 데이터 생성 가이드 */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <RefreshCw className="w-6 h-6" />
            새 데이터 생성 방법
          </h2>

          <div className="space-y-3">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <h3 className="font-bold mb-2">즉시 생성 (1회 실행)</h3>
              <code className="block bg-black/30 rounded px-4 py-2 font-mono text-sm">
                cd {outputDir.replace("/output", "")}
                <br />
                python scheduler.py --once
              </code>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <h3 className="font-bold mb-2">
                자동 스케줄 (매일 08:30, 12:30, 15:30 KST)
              </h3>
              <code className="block bg-black/30 rounded px-4 py-2 font-mono text-sm">
                python scheduler.py
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
