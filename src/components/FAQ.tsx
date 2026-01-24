import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import './FAQ.css';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
  title?: string;
  showSchema?: boolean;
}

// Generate FAQ Schema Markup
const generateFAQSchema = (faqs: FAQItem[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};

const FAQ: React.FC<FAQProps> = ({ 
  faqs, 
  title = 'Câu hỏi thường gặp',
  showSchema = true 
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Inject FAQ Schema into document head
  useEffect(() => {
    if (!showSchema) return;

    const scriptId = 'faq-schema-markup';
    
    // Remove existing script if any
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    // Create and inject new script
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(generateFAQSchema(faqs));
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [faqs, showSchema]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-section">

      <div className="faq-header">
        <HelpCircle size={28} className="faq-icon" />
        <h2>{title}</h2>
      </div>

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`faq-item ${openIndex === index ? 'open' : ''}`}
          >
            <button 
              className="faq-question"
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
            >
              <span className="question-text">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp size={20} className="faq-chevron" />
              ) : (
                <ChevronDown size={20} className="faq-chevron" />
              )}
            </button>
            
            <div 
              className="faq-answer"
              style={{
                maxHeight: openIndex === index ? '500px' : '0',
                opacity: openIndex === index ? 1 : 0
              }}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Pre-defined FAQs for YoungHouse
export const youngHouseFAQs: FAQItem[] = [
  {
    question: 'Young House có những chi nhánh nào và ở đâu?',
    answer: 'Young House có 14 chi nhánh tập trung ở 3 khu vực chính: Tân Xã (Young House 1, 4, 5, 7, 8), Phú Hữu (Young House 2, 11, 12, 14), và Bình Yên (Young House 6, 9, 10). Tất cả đều cách trường FPT University từ 2-4km, thuận tiện cho sinh viên di chuyển.'
  },
  {
    question: 'Giá phòng trọ Young House là bao nhiêu?',
    answer: 'Giá phòng trọ Young House dao động từ 1.4 triệu đến 4.5 triệu VND/tháng tùy loại phòng. Phòng đơn từ 1.4-2 triệu, phòng đôi từ 2-2.6 triệu, phòng gác xép từ 2-2.5 triệu, và căn 2 ngủ từ 4-4.5 triệu. Giá đã bao gồm nội thất đầy đủ.'
  },
  {
    question: 'Phòng trọ Young House có những tiện ích gì?',
    answer: 'Tất cả phòng trọ Young House đều được trang bị đầy đủ: điều hòa, nóng lạnh, tủ lạnh, giường, tủ quần áo, bàn học, tủ bếp nấu ăn, thiết bị vệ sinh cao cấp. Tòa nhà có thang máy, khóa vân tay, wifi tốc độ cao, máy giặt miễn phí, camera an ninh 24/7, và hệ thống PCCC theo tiêu chuẩn.'
  },
  {
    question: 'Phí dịch vụ và tiền điện tính như thế nào?',
    answer: 'Phí dịch vụ (bao gồm nước, wifi, thang máy, máy giặt, vệ sinh, điện hành lang) từ 180.000-230.000 VND/người/tháng tùy chi nhánh. Tiền điện tính 3.200 VND/số theo đồng hồ riêng từng phòng.'
  },
  {
    question: 'Làm thế nào để đặt lịch xem phòng?',
    answer: 'Bạn có thể đặt lịch xem phòng qua nhiều cách: Gọi hotline 0372858098, nhắn Zalo, hoặc điền form đặt lịch trực tiếp trên website. Đội ngũ hỗ trợ 24/7 từ thứ 2 đến Chủ nhật.'
  },
  {
    question: 'Young House có chính sách ưu đãi gì cho khách hàng mới?',
    answer: 'Khách hàng mới 2025 được tặng Voucher sử dụng 10 sản phẩm tại Young Food & Drink, tặng 10 cốc nước hoặc 1 bánh Pizza khi tổ chức sinh nhật. Ngoài ra, giảm 4% tiền thuê khi thanh toán 6 tháng và 8% khi thanh toán 12 tháng (chuyển khoản trong 48h kể từ ngày ký hợp đồng).'
  },
  {
    question: 'Phòng trọ có an ninh không?',
    answer: 'Young House rất chú trọng an ninh với hệ thống khóa vân tay ra vào, camera an ninh full tòa nhà 24/7, bảo vệ, và hệ thống phòng cháy chữa cháy theo tiêu chuẩn. Chỗ để xe được bảo vệ với cửa khóa vân tay riêng.'
  },
  {
    question: 'Có thể nấu ăn trong phòng không?',
    answer: 'Có, tất cả phòng đều được trang bị tủ bếp nấu ăn. Một số phòng còn có bếp từ. Bạn hoàn toàn có thể nấu ăn thoải mái trong phòng.'
  },
  {
    question: 'Hợp đồng thuê phòng tối thiểu bao lâu?',
    answer: 'Hợp đồng thuê phòng tối thiểu thường là 6 tháng. Tuy nhiên, bạn có thể trao đổi trực tiếp với quản lý để được tư vấn phù hợp với nhu cầu.'
  },
  {
    question: 'Khoảng cách từ Young House đến trường FPT là bao xa?',
    answer: 'Các chi nhánh Young House cách trường FPT University từ 2-4km, tương đương 5-10 phút di chuyển bằng xe máy. Đường đi thuận tiện qua khu công nghệ cao hoặc đường làng an toàn.'
  }
];

export default FAQ;
