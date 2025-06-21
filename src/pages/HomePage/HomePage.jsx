import React from 'react';
import img1 from '../../assets/img1.jpg';
import img3 from '../../assets/babauDrikMilk.jpg';
import img4 from '../../assets/circle.png'
import { BsStars } from "react-icons/bs";
import { Link } from 'react-router-dom';
import CardSlider from '../../components/cardslide/cardSlider';
import CommunityCardSection from '../../components/communitycard/communitycard';
import CardMemberSection from '../../components/cardMember/cardMember';
import ContactFormSection from '../../components/form/form';

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
        <div style={{ padding: '0px' }}>
      <CardSlider />
      {/* <CommunityCardSection/> */}
      <CardMemberSection/>
      <ContactFormSection/>
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
    maxWidth: '600px',
    margin:' 0 auto',
    textAlign: 'center',



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

  '@media (max-width: 502px)': {
    container: {
      padding: '0 8px',
      gap: '25px',
    },
    imageBox: {
      maxWidth: '100%',
    },
    image: {
      width: '100%',
      height: 'auto',
      borderRadius: '20px',
      objectFit: 'cover',
    },
    textOverlay: {
      bottom: '8px',
      left: '8px',
    },
    subText: {
      fontSize: '11px',
    },
    title: {
      fontSize: '18px',
    },
    textBox: {
      padding: '8px',
      textAlign: 'center',
    },
    heading: {
      fontSize: '20px',
      marginBottom: '8px',
    },
    paragraph: {
      fontSize: '14px',
    },
    cardRow: {
      gap: '15px',
      flexDirection: 'column',
      alignItems: 'center',
    },
    cardBox: {
      width: '95%',
      maxWidth: '300px',
      height: 'auto',
      padding: '15px',
    },
    cardTitle: {
      fontSize: '20px',
    },
    cardText: {
      fontSize: '13px',
    },
    DirectBox: {
      width: '100%',
      justifyContent: 'center',
      padding: '12px',
    },
    iconBox: {
      width: '40px',
      height: '40px',
    },
    aiCard: {
      width: '95%',
      maxWidth: '300px',
      height: 'auto',
      padding: '15px',
      flexDirection: 'column',
    },
    aiIcon: {
      width: '120px',
      height: '80px',
      marginBottom: '6px',
    },
    aiTextPink: {
      fontSize: '24px',
    },
    aiTextBlack: {
      fontSize: '24px',
    },
    imageCard: {
      width: '95%',
      maxWidth: '300px',
      height: 'auto',
      marginTop: '15px',
    },
    speechBubble: {
      top: '-20px',
      padding: '4px 6px',
      maxWidth: '200px',
    },
    BubbleText: {
      fontSize: '14px',
    },
    speechSubText: {
      fontSize: '10px',
    },
    cardImage: {
      width: '100%',
      height: 'auto',
      borderRadius: '20px',
    },
    TextMiddle: {
      marginBottom: '30px',
    },
    TitleMiddle: {
      fontSize: '24px',
      marginTop: '20px',
      lineHeight: '1.4',
    },
    subTextMiddle: {
      fontSize: '14px',
      padding: '0 8px',
    },
  },

  '@media (max-width: 375px)': {
    container: {
      padding: '0 5px',
      gap: '15px',
    },
    image: {
      height: '200px',
    },
    textOverlay: {
      bottom: '5px',
      left: '5px',
    },
    subText: {
      fontSize: '9px',
    },
    title: {
      fontSize: '16px',
    },
    textBox: {
      padding: '5px',
    },
    heading: {
      fontSize: '18px',
      marginBottom: '5px',
    },
    paragraph: {
      fontSize: '12px',
    },
    cardBox: {
      padding: '10px',
    },
    cardTitle: {
      fontSize: '16px',
    },
    cardText: {
      fontSize: '10px',
    },
    iconBox: {
      width: '35px',
      height: '35px',
    },
    aiIcon: {
      width: '100px',
      height: '70px',
      marginBottom: '5px',
    },
    aiTextPink: {
      fontSize: '20px',
    },
    aiTextBlack: {
      fontSize: '20px',
    },
    speechBubble: {
      top: '-15px',
      padding: '3px 5px',
      maxWidth: '180px',
    },
    BubbleText: {
      fontSize: '12px',
    },
    speechSubText: {
      fontSize: '8px',
    },
    TextMiddle: {
      marginBottom: '15px',
    },
    TitleMiddle: {
      fontSize: '18px',
      marginTop: '15px',
      lineHeight: '1.5',
    },
    subTextMiddle: {
      fontSize: '11px',
      padding: '0 5px',
    },
  },

  // Further refinements for very small screens (e.g., older iPhones)
  '@media (max-width: 320px)': {
    container: {
      padding: '0 5px',
      gap: '10px',
    },
    image: {
      height: '180px',
    },
    textOverlay: {
      bottom: '5px',
      left: '5px',
    },
    subText: {
      fontSize: '8px',
    },
    title: {
      fontSize: '14px',
    },
    textBox: {
      padding: '5px',
    },
    heading: {
      fontSize: '16px',
      marginBottom: '5px',
    },
    paragraph: {
      fontSize: '11px',
    },
    cardBox: {
      padding: '8px',
    },
    cardTitle: {
      fontSize: '14px',
    },
    cardText: {
      fontSize: '9px',
    },
    iconBox: {
      width: '30px',
      height: '30px',
    },
    aiIcon: {
      width: '80px',
      height: '60px',
      marginBottom: '4px',
    },
    aiTextPink: {
      fontSize: '18px',
    },
    aiTextBlack: {
      fontSize: '18px',
    },
    speechBubble: {
      top: '-10px',
      padding: '2px 4px',
      maxWidth: '150px',
    },
    BubbleText: {
      fontSize: '11px',
    },
    speechSubText: {
      fontSize: '7px',
    },
    TextMiddle: {
      marginBottom: '10px',
    },
    TitleMiddle: {
      fontSize: '16px',
      marginTop: '10px',
      lineHeight: '1.6',
    },
    subTextMiddle: {
      fontSize: '10px',
      padding: '0 5px',
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
    height: 'auto',
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
    height:'auto',
    flex: '1 1 300px',
    maxWidth: '500px',
    display: 'flex',
    borderRadius:'20px',
    flexDirection: 'column',
    backgroundColor: '#fff0fa',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center'
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
    height:'auto',
    maxWidth: '486px',
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
