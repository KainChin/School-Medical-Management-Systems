import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import newsData from '../../data/newsData';
import './News.css';

// API Configuration
const API_BASE_URL = 'http://localhost:5001/api';

// Categories for filtering
const NEWS_CATEGORIES = [
    { key: 'all', label: 'Tất cả' },
    { key: 'suc-khoe', label: 'Sức khỏe' },
    { key: 'y-te', label: 'Y tế' },
    { key: 'dinh-duong', label: 'Dinh dưỡng' },
    { key: 'vaccine', label: 'Vaccine' }
];

// Mock data cho fallback
// eslint-disable-next-line no-unused-vars
const mockNewsData = [
    {
        id: 1,
        title: "Chương trình tiêm vaccine COVID-19 cho học sinh",
        summary: "Bộ Y tế công bố kế hoạch triển khai tiêm vaccine COVID-19 cho học sinh từ 12 tuổi trở lên trong các trường học...",
        image: "https://via.placeholder.com/400x250/4285f4/ffffff?text=Vaccine+News",
        category: "Sức khỏe",
        publishDate: "2025-07-02",
        source: "Báo Sức khỏe Đời sống",
        isHighlight: true,
        link: "#"
    },
    {
        id: 2,
        title: "Hướng dẫn dinh dưỡng cho học sinh mùa thi",
        summary: "Các chuyên gia dinh dưỡng đưa ra lời khuyên về chế độ ăn uống hợp lý cho học sinh trong mùa thi...",
        image: "https://via.placeholder.com/300x200/34a853/ffffff?text=Dinh+Duong",
        category: "Dinh dưỡng",
        publishDate: "2025-07-01",
        source: "VnExpress Sức khỏe",
        link: "#"
    },
    {
        id: 3,
        title: "Phòng chống cận thị ở học sinh",
        summary: "Tỷ lệ cận thị ở học sinh Việt Nam đang gia tăng. Các biện pháp phòng ngừa hiệu quả...",
        image: "https://via.placeholder.com/300x200/ea4335/ffffff?text=Can+Thi",
        category: "Mắt",
        publishDate: "2025-06-30",
        source: "Tuổi Trẻ Online",
        link: "#"
    },
    {
        id: 4,
        title: "Khám sức khỏe định kỳ cho học sinh",
        summary: "Tầm quan trọng của việc khám sức khỏe định kỳ trong phát hiện sớm các vấn đề sức khỏe ở học sinh...",
        image: "https://via.placeholder.com/300x200/f39c12/ffffff?text=Kham+Suc+Khoe",
        category: "Y tế",
        publishDate: "2025-06-29",
        source: "Sức khỏe Đời sống",
        link: "#"
    },
    {
        id: 5,
        title: "Phòng chống stress trong môi trường học đường",
        summary: "Các biện pháp giúp học sinh quản lý stress hiệu quả trong quá trình học tập...",
        image: "https://via.placeholder.com/300x200/9b59b6/ffffff?text=Stress",
        category: "Tâm lý",
        publishDate: "2025-06-28",
        source: "Báo Giáo dục",
        link: "#"
    },
    {
        id: 6,
        title: "Tăng cường miễn dịch cho trẻ em",
        summary: "Các phương pháp tự nhiên và an toàn để tăng cường sức đề kháng cho trẻ em...",
        image: "https://via.placeholder.com/300x200/e67e22/ffffff?text=Mien+Dich",
        category: "Sức khỏe",
        publishDate: "2025-06-27",
        source: "VnExpress Sức khỏe",
        link: "#"
    },
    {
        id: 7,
        title: "An toàn thực phẩm trong bữa ăn học đường",
        summary: "Hướng dẫn đảm bảo an toàn thực phẩm cho bữa ăn bán trú tại các trường học...",
        image: "https://via.placeholder.com/300x200/27ae60/ffffff?text=An+Toan+Thuc+Pham",
        category: "Dinh dưỡng",
        publishDate: "2025-06-26",
        source: "Tuổi Trẻ Online",
        link: "#"
    },
    {
        id: 8,
        title: "Vệ sinh răng miệng cho học sinh",
        summary: "Tầm quan trọng của việc chăm sóc răng miệng và các biện pháp phòng ngừa sâu răng...",
        image: "https://via.placeholder.com/300x200/3498db/ffffff?text=Rang+Mieng",
        category: "Nha khoa",
        publishDate: "2025-06-25",
        source: "Báo Sức khỏe Đời sống",
        link: "#"
    }
];

export default function News() {
    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    const [highlightNews, setHighlightNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [totalNews, setTotalNews] = useState(0);    // Function để fetch tin tức từ API
    const fetchNews = useCallback(async (pageNum = 1, append = false, category = 'all') => {
        try {
            if (!append) {
                setLoading(true);
                setError(null);
            } else {
                setLoadingMore(true);
            }

            console.log(`Đang lấy tin tức trang ${pageNum} từ server...`);

            // Xây dựng URL API - ưu tiên API lấy nội dung đầy đủ
            let apiUrl = `${API_BASE_URL}/news/full?page=${pageNum}&limit=10`;

            // Nếu có category specific, dùng endpoint khác
            if (category !== 'all') {
                apiUrl = `${API_BASE_URL}/news/category/${category}?page=${pageNum}&limit=10`;
            }

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 15000 // 15 giây timeout để lấy nội dung đầy đủ
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.data && data.data.length > 0) {
                let newArticles = data.data;

                // Lọc theo search term nếu có
                if (searchTerm) {
                    newArticles = newArticles.filter(article =>
                        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (article.content && article.content.toLowerCase().includes(searchTerm.toLowerCase()))
                    );
                }

                if (append) {
                    // Thêm tin tức mới vào cuối danh sách
                    setNews(prevNews => [...prevNews, ...newArticles]);
                } else {
                    // Thay thế toàn bộ danh sách
                    setNews(newArticles);
                    setHighlightNews(newArticles.find(item => item.isHighlight) || newArticles[0]);
                }

                setTotalNews(data.pagination?.total || newArticles.length);
                setLastUpdated(data.lastUpdated);
                setHasMore(data.pagination?.hasNext || newArticles.length === 10);
                console.log(`✅ Đã tải ${newArticles.length} bài tin tức từ API (${newArticles.filter(a => a.fullContent).length} bài có nội dung đầy đủ)`);
                setError(null); // Clear any previous errors
            } else {
                throw new Error(data.error || 'Không có dữ liệu tin tức');
            }

        } catch (error) {
            console.error('❌ Lỗi khi lấy tin tức từ API:', error);
            setError(`Không thể kết nối server: ${error.message}`);

            // Chỉ fallback to mock data nếu là lần đầu load
            if (!append && pageNum === 1) {
                console.log('🔄 Sử dụng dữ liệu mẫu...');
                const expandedMockData = [];
                // Tạo thêm mock data để test infinite scroll
                for (let i = 0; i < 15; i++) {
                    newsData.forEach((item, index) => {
                        expandedMockData.push({
                            ...item,
                            id: `fallback-${i}-${index}`,
                            title: `${item.title} - Bản demo ${i + 1}`,
                            publishDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            source: `${item.source} (Demo)`,
                            isHighlight: i === 0 && index === 0,
                            fullContent: true // Mock data có nội dung đầy đủ
                        });
                    });
                }
                setNews(expandedMockData);
                setHighlightNews(expandedMockData.find(item => item.isHighlight));
                setTotalNews(expandedMockData.length);
                setHasMore(true);
            }

        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [searchTerm]);

    // Function để tìm kiếm tin tức
    // eslint-disable-next-line no-unused-vars
    const searchNews = async (query) => {
        if (!query.trim()) {
            fetchNews(1, false, selectedCategory);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/news/search?q=${encodeURIComponent(query)}&category=${selectedCategory !== 'all' ? selectedCategory : ''}&limit=20`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000
            });

            if (!response.ok) {
                throw new Error(`Search error: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.data) {
                setNews(data.data);
                setHighlightNews(data.data.find(item => item.isHighlight) || data.data[0]);
                setTotalNews(data.total);
                setHasMore(false); // Tìm kiếm không hỗ trợ infinite scroll
                console.log(`✅ Tìm thấy ${data.data.length} kết quả cho "${query}"`);
            } else {
                setNews([]);
                setHighlightNews(null);
                setTotalNews(0);
                setHasMore(false);
            }

        } catch (error) {
            console.error('❌ Lỗi khi tìm kiếm:', error);
            setError(`Không thể tìm kiếm: ${error.message}`);

            // Fallback tìm kiếm trong mock data
            const filteredMockData = newsData.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.summary.toLowerCase().includes(query.toLowerCase()) ||
                (item.content && item.content.toLowerCase().includes(query.toLowerCase()))
            );

            setNews(filteredMockData);
            setHighlightNews(filteredMockData[0] || null);
            setTotalNews(filteredMockData.length);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop
                >= document.documentElement.offsetHeight - 1000 && // Trigger khi còn 1000px nữa đến cuối
                hasMore &&
                !loadingMore &&
                !loading
            ) {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchNews(nextPage, true, selectedCategory);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [page, hasMore, loadingMore, loading, selectedCategory, fetchNews]);

    useEffect(() => {
        // Khởi tạo với mock data ngay lập tức
        console.log('Initializing News component with mock data...');
        const expandedMockData = [];

        // Tạo thêm mock data để test
        for (let i = 0; i < 10; i++) {
            newsData.forEach((item, index) => {
                expandedMockData.push({
                    ...item,
                    id: `mock-${i}-${index}`,
                    title: `${item.title} - Phiên bản ${i + 1}`,
                    publishDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                });
            });
        }

        setNews(expandedMockData);
        setHighlightNews(expandedMockData.find(item => item.isHighlight) || expandedMockData[0]);
        setTotalNews(expandedMockData.length);
        setHasMore(true);
        setLoading(false);

        // Sau đó thử fetch từ API
        fetchNews(1, false, selectedCategory);
    }, [selectedCategory, fetchNews]);

    // Xử lý tìm kiếm
    useEffect(() => {
        if (searchTerm) {
            const debounceTimer = setTimeout(() => {
                setPage(1);
                fetchNews(1, false, selectedCategory);
            }, 500);

            return () => clearTimeout(debounceTimer);
        }
    }, [searchTerm, selectedCategory, fetchNews]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const handleArticleClick = (article) => {
        navigate(`/news/${article.id}`);
    };

    const handleRefresh = () => {
        setPage(1);
        setHasMore(true);
        setSearchTerm('');
        setSelectedCategory('all');
        fetchNews(1, false, 'all');
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setPage(1);
        setHasMore(true);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    if (loading) {
        return (
            <div>
                <Header />
                <div className="news-container">
                    <div className="loading">
                        <div className="loading-spinner"></div>
                        <p>🔄 Đang tải tin tức y tế từ các nguồn uy tín...</p>
                        <p className="loading-subtitle" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            VnExpress, Tuổi Trẻ, Sức khỏe Đời sống
                        </p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="news-container">
                {/* Breadcrumb - Fixed */}
                <div className="breadcrumb-fixed">
                    🏠 <a href="/">Trang chủ</a> &nbsp;›&nbsp; 📰 Tin tức
                </div>

                {/* Page Title with Controls */}
                <div className="news-header">
                    <h1 className="news-page-title">📰 Tin tức Y tế - Sức khỏe</h1>
                    <div className="news-controls">
                        <div className="search-section">
                            <input
                                type="text"
                                placeholder="🔍 Tìm kiếm tin tức..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="search-input"
                            />
                            <i className="fas fa-search search-icon"></i>
                        </div>
                        <button onClick={handleRefresh} className="refresh-button">
                            <i className="fas fa-sync-alt"></i>
                            Cập nhật
                        </button>
                        {lastUpdated && (
                            <span className="last-updated">
                                ⏰ Cập nhật: {formatDate(lastUpdated)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Category Filter */}
                <div className="category-filter">
                    {NEWS_CATEGORIES.map(category => (
                        <button
                            key={category.key}
                            onClick={() => handleCategoryChange(category.key)}
                            className={`category-btn ${selectedCategory === category.key ? 'active' : ''}`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* News Stats */}
                <div className="news-stats">
                    <p>
                        <i className="fas fa-newspaper"></i>
                        Hiển thị {news.length} trong tổng số {totalNews} bài tin tức
                        {searchTerm && ` - Tìm kiếm: "${searchTerm}"`}
                        {selectedCategory !== 'all' && ` - Danh mục: ${NEWS_CATEGORIES.find(c => c.key === selectedCategory)?.label}`}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        ⚠️ {error}. Đang hiển thị dữ liệu mẫu.
                    </div>
                )}

                {/* Highlight News */}
                {highlightNews && (
                    <div className="highlight-section">
                        <div className="highlight-news" onClick={() => handleArticleClick(highlightNews)}>
                            <img src={highlightNews.image} alt={highlightNews.title} />
                            <div className="highlight-content">
                                <span className="highlight-category">{highlightNews.category}</span>
                                <h2>{highlightNews.title}</h2>
                                <p>{highlightNews.summary}</p>
                                <div className="highlight-meta">
                                    <span>{highlightNews.source}</span>
                                    <span>{formatDate(highlightNews.publishDate)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* News Grid */}
                <div className="news-grid">
                    <div className="news-sidebar">
                        <h3>Góc Y tế</h3>
                        <div className="sidebar-articles">
                            {news.slice(1, 4).map(article => (
                                <div key={article.id} className="sidebar-article" onClick={() => handleArticleClick(article)}>
                                    <img src={article.image} alt={article.title} />
                                    <div className="sidebar-content">
                                        <h4>{article.title}</h4>
                                        <span className="article-date">{formatDate(article.publishDate)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="news-main">
                        {news.slice(4).map(article => (
                            <div key={article.id} className="news-card" onClick={() => handleArticleClick(article)}>
                                <img src={article.image} alt={article.title} />
                                <div className="news-card-content">
                                    <span className="news-category">{article.category}</span>
                                    <h3>{article.title}</h3>
                                    <p>{article.summary}</p>
                                    <div className="news-meta">
                                        <span>{article.source}</span>
                                        <span>{formatDate(article.publishDate)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* News Footer */}
                <div className="news-footer">
                    {hasMore && (
                        <p className="scroll-hint">
                            <i className="fas fa-arrow-down"></i>
                            Cuộn xuống để xem thêm tin tức
                        </p>
                    )}
                    <div className="news-sources">
                        <p>
                            <i className="fas fa-globe"></i>
                            Nguồn tin: VnExpress, Tuổi Trẻ, Sức khỏe Đời sống
                        </p>
                    </div>
                </div>

                {/* Loading More Indicator */}
                {loadingMore && (
                    <div className="loading-more">
                        <div className="loading-spinner-small"></div>
                        <p>Đang tải thêm tin tức...</p>
                    </div>
                )}

                {/* End of News Indicator */}
                {!hasMore && news.length > 0 && (
                    <div className="end-of-news">
                        <p>🎉 Bạn đã xem hết tất cả tin tức!</p>
                        <button onClick={handleRefresh} className="refresh-button">
                            🔄 Tải lại từ đầu
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}