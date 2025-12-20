import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cvService } from '../services/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Calendar, 
  Sparkles,
  AlertCircle,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';

const History = () => {
  const { t } = useTranslation();
  const [cvList, setCvList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCV, setSelectedCV] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    filterAndSortCVs();
  }, [cvList, searchQuery, sortOrder]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await cvService.getHistory();
      if (response.success) {
        setCvList(response.data || []);
      }
    } catch (err) {
      setError(t('common.error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCVs = () => {
    let filtered = [...cvList];

    if (searchQuery.trim()) {
      filtered = filtered.filter(cv =>
        cv.jobDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cv.optimizedCVText?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredList(filtered);
  };

  const handleViewCV = async (id) => {
    try {
      const response = await cvService.getById(id);
      if (response.success) {
        setSelectedCV(response.data);
      }
    } catch (err) {
      setError(t('common.error'));
      console.error(err);
    }
  };

  const handleDownloadPDF = (cvHTML) => {
    if (!cvHTML) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(cvHTML);
    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('history.today');
    if (diffDays === 1) return t('history.yesterday');
    if (diffDays < 7) return t('history.daysAgo', { count: diffDays });
    if (diffDays < 30) return t('history.weeksAgo', { count: Math.floor(diffDays / 7) });
    return t('history.monthsAgo', { count: Math.floor(diffDays / 30) });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-lg text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">{t('history.title')}</h1>
          <p className="text-xl text-muted-foreground mt-2">
            {cvList.length === 1 
              ? t('history.subtitle', { count: cvList.length })
              : t('history.subtitle_plural', { count: cvList.length })
            }
          </p>
        </div>
        <Button asChild size="lg" className="gap-2">
          <Link to="/generate">
            <Sparkles className="h-5 w-5" />
            {t('history.generateNew')}
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {cvList.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{t('history.empty.title')}</h2>
              <p className="text-muted-foreground max-w-md">
                {t('history.empty.description')}
              </p>
            </div>
            <Button asChild size="lg" className="mt-4">
              <Link to="/generate">
                <Sparkles className="mr-2 h-5 w-5" />
                {t('history.empty.button')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Filters and Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('history.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="gap-2"
                >
                  {sortOrder === 'desc' ? (
                    <>
                      <SortDesc className="h-4 w-4" />
                      {t('history.sortNewest')}
                    </>
                  ) : (
                    <>
                      <SortAsc className="h-4 w-4" />
                      {t('history.sortOldest')}
                    </>
                  )}
                </Button>
              </div>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-3">
                  {filteredList.length === 1
                    ? t('history.resultsFound', { count: filteredList.length })
                    : t('history.resultsFound_plural', { count: filteredList.length })
                  }
                </p>
              )}
            </CardContent>
          </Card>

          {/* CV List */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredList.map((cv) => (
              <Card 
                key={cv._id} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-500"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        {t('history.cvGenerated')}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3" />
                        {getRelativeTime(cv.createdAt)}
                      </CardDescription>
                    </div>
                    <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {t('history.newBadge')}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                        {t('history.jobDescription')}
                      </p>
                      <p className="text-sm line-clamp-3">
                        {cv.jobDescription?.substring(0, 120)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(cv.createdAt)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1 group-hover:bg-blue-50 group-hover:border-blue-500"
                        onClick={() => handleViewCV(cv._id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {t('history.viewButton')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{t('history.modal.title')}</DialogTitle>
                        <DialogDescription>
                          {t('history.generatedOn', { date: formatDate(cv.createdAt) })}
                        </DialogDescription>
                      </DialogHeader>
                      {selectedCV && selectedCV._id === cv._id && (
                        <div className="space-y-4">
                          <Button
                            onClick={() => handleDownloadPDF(selectedCV.cvHTML)}
                            className="w-full"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            {t('history.modal.downloadPDF')}
                          </Button>
                          <div
                            className="bg-white p-8 rounded-lg border"
                            dangerouslySetInnerHTML={{ __html: selectedCV.cvHTML }}
                          />
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button
                    onClick={() => handleDownloadPDF(cv.cvHTML)}
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {t('history.downloadButton')}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredList.length === 0 && searchQuery && (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold">{t('history.noResults.title')}</h3>
                  <p className="text-muted-foreground">
                    {t('history.noResults.description', { query: searchQuery })}
                  </p>
                </div>
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  {t('history.noResults.button')}
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default History;
