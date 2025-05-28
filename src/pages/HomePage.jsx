import React from 'react';
import img1 from '../assets/img1.jpg';
import img2 from '../assets/circleline.png';
import img3 from '../assets/babauDrikMilk.jpg';
import img4 from '../assets/circle.png'
import { BsStars } from "react-icons/bs";
import { Link } from 'react-router-dom';
import CardSlider from '../components/cardslide/cardSlider';

const HomePage = () => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.imageBox}>
          <img src={img1} alt="img1" style={styles.image} />

          <div style={styles.textOverlay}>
            <span style={styles.subText}>Theo Dõi Ngay</span>
            <h2 style={styles.title}>Cùng nhau theo dõi quá trình thai kỳ</h2>
          </div>
        </div>
        <div style={styles.textBox}>
          <h1 style={styles.heading}>Chăm sóc con, yêu bản thân!</h1>
          <p style={styles.paragraph}>
            Chăm sóc bản thân khi mang thai là cách yêu thương em bé ngay từ trong bụng mẹ.
            Hãy duy trì chế độ dinh dưỡng hợp lý, nghỉ ngơi đầy đủ và giữ tinh thần thoải mái.
            Lắng nghe cơ thể, thư giãn và tận hưởng hành trình làm mẹ với sự yêu thương và trân trọng.
          </p>
        </div>
        <div style={styles.cardRow}>
          <div style={styles.cardBox}>
            <h3 style={styles.cardTitle}>Tư vấn trực tuyến cùng bác sĩ chuyên môn</h3>
            <p style={styles.cardText}>
              Hỗ trợ kịp thời các vấn đề sức khỏe thai kỳ thông qua đặt lịch tư vấn trực tuyến với đội ngũ bác sĩ, chuyên gia sản khoa uy tín.
            </p>
            <div style={styles.DirectBox}>
              <Link to="#" style={styles.iconBox}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FF66CC" // hồng đậm
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </Link>
            </div>
          </div>

          <div style={styles.aiCard }>
            {/* <img src= {img2} alt="cirlLine" style={styles.aiIcon}  /> */}
            {/* <BsStars style={styles.aiIcon} /> */}
            <img src={img4} alt='circle' style={styles.aiIcon} />

            <div>
              <span style={styles.aiTextPink}>Với AI</span>
              <span style={styles.aiTextBlack}>, hỗ trợ nhanh chóng</span>
            </div>
          </div>

          <div style={styles.imageCard}>
            <div style={styles.speechBubble}>
              <strong style={styles.BubbleText}> Cảm thấy an tâm và thoải mái với dịch vụ!</strong>
              <p style={styles.speechSubText}>Have a nice day, Nesya. Keep smiling and maintain your days well.</p>
            </div>
            <img
              src={img3}
              alt="pregnant woman"
              style={styles.cardImage}
            />
          </div>
        </div>
        <div style={styles.TextMiddle}>
          <h1 style={styles.TitleMiddle} >Chúng tôi là ai ?</h1>
          <p style={styles.subTextMiddle}>Chúng tôi cung cấp nền tảng hỗ trợ chăm sóc sức khỏe thai kỳ cá nhân hóa bằng AI – giúp mẹ bầu theo dõi quá trình mang thai, nhận tư vấn phù hợp và kết nối cộng đồng một cách an toàn và tiện lợi.</p>
        </div>
        <div style={{ padding: '40px' }}>
      <CardSlider />
    </div>
      </div>

    </div>
  );
};

const styles = {
  wrapper: {
    width: '100%',
    display: 'flex',
    backgroundColor: '#fff',
    padding: '40px 0',

  },
  container: {
    gap: '60px',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    padding: '0 20px',
    boxSizing: 'border-box',
    flexWrap: 'wrap',
    justifyContent: 'center', // Center content for smaller screens
  },
  imageBox: {
    position: 'relative',
    width: '100%',
    maxWidth: '680px', // Prevent image from becoming too large
    borderRadius: '20px',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  image: {
    width: '783px',
    height: '431px',
    objectFit: 'cover',
    borderRadius: '20px',
  },
  textOverlay: {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    color: '#fff',
  },
  subText: {
    fontSize: '14px',
    opacity: 0.9,
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    lineHeight: '1.3',
    margin: '8px 0 0',
  },
  textBox: {
    width: '100%',
    maxWidth: '600px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'left',
  },
  heading: {
    fontSize: '70px',
    fontWeight: '400',
    lineHeight: '1.2',
    marginBottom: '20px',
  },
  paragraph: {
    fontSize: '24px',
    lineHeight: '1.2',
    color: '#666',
    opacity: '50%',
  },

  // Media Queries for Responsiveness
  '@media (max-width: 1200px)': {
    container: {
      padding: '0 50px',
    },
    imageBox: {
      maxWidth: '600px',
    },
    textBox: {
      width: '60%',
    },
  },
  '@media (max-width: 992px)': {
    container: {
      padding: '0 20px',
    },
    imageBox: {
      maxWidth: '500px',
    },
    textBox: {
      width: '100%',
      textAlign: 'center',
    },
  },
  '@media (max-width: 768px)': {
    container: {
      padding: '0 10px',
    },
    imageBox: {
      maxWidth: '100%',
    },
    textBox: {
      width: '100%',
    },
    heading: {
      fontSize: '36px',
    },
    paragraph: {
      fontSize: '16px',
    },
  },
  '@media (max-width: 576px)': {
    heading: {
      fontSize: '30px',
    },
    paragraph: {
      fontSize: '14px',
    },
  },


  ////card
  cardRow: {
    display: 'flex',
    gap: '40px',
    flexWrap: 'wrap',
    justifyContent: 'center',

  },

  cardBox: {
    flex: '1 1 300px',
    backgroundColor: '#FFEEFA',
    borderRadius: '24px',
    padding: '30px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '600px',
    maxWidth: '312px',
    position: 'relative',
  },

  cardTitle: {
    fontSize: '32px',
    fontWeight: '600',
    color: '#000',
  },

  cardText: {
    marginTop: '10px',
    fontSize: '24px',
    fontWeight: '400',
    color: '#666',
  },

  DirectBox: {
    backgroundColor: '#FFF0FA', // hồng nhạt
  padding: '20px',
  borderRadius: '20px',
  display: 'inline-block',
  justifyContent: 'flex-start',
  width: 'fit-content',
  transition: 'all 0.3s ease',
  cursor: 'pointer',

  '&:hover': {
    backgroundColor: '#ffe4f0', // màu hồng nhạt hơn khi hover
    transform: 'translateY(-2px)', // hiệu ứng nổi nhẹ
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // đổ bóng nhẹ
  },
  },
  iconBox: {
    backgroundColor: '#fff',
    width: '96px',
    height: '96px',
    borderRadius: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    
  },

  aiCard: {
    width:'500px',
    height:'600px',
    display: 'flex',
    borderRadius:'20px',
    flexDirection: 'column',
    backgroundColor: '#fff0fa',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },

  aiIcon: {
    width: '305px',
    height: '217px',
    borderRadius: '50%',
    marginBottom: '16px',
    color: '#FF85DA',
    alignSelf: 'center',
  },

  aiTextPink: {
    color: '#ff4fcf',
    fontWeight: '500',
    fontSize: '64px',
  },

  aiTextBlack: {
    fontSize: '64px',
    fontWeight: 'bold',
    color: '#000',
  },

  imageCard: {
    flex: '1 1 300px',
    width: '486px',
    height:'432.03px',
    marginTop:'40px',
    borderRadius: '24px',
    overflow: 'visible',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },

  speechBubble: {
    position: 'absolute',
    top: '-60px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#ffe5f6',
    borderRadius: '16px',
    padding: '10px 14px',
    fontSize: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    width: '90%',            // hoặc 'maxWidth: 306' để không vượt quá
    maxWidth: '306px',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  BubbleText:{
    fontSize:'24px',
    fontWeight:'400',
    color:'#FF85DA'
  },

  speechSubText: {
    marginTop: '4px',
    fontSize: '16px',
    fontWeight:'400',
    opacity:'0.7',
    color:'#000000',
  },

  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '20px',
  },

  TextMiddle:{
    textAlign:'center',
    marginBottom:'200px'
  },
  TitleMiddle:{
    color:'#FF85DA',
    fontSize:'64px',
    fontWeight:'400',
    marginTop:'100px',
    lineHeight:'200px'
  },
  subTextMiddle:{
    fontSize:'36px',
    fontWeight:'400',

  },

};

export default HomePage;
