document.addEventListener("DOMContentLoaded", function() {
  // Firebase configuration (본인의 Firebase 설정 정보로 교체)
  var firebaseConfig = {
      apiKey: "AIzaSyA2yiYsCUGxsnDQBwCUUgEVYHi3yCMBwyc",
      authDomain: "juwon-portfolio.firebaseapp.com",
      projectId: "juwon-portfolio",
      storageBucket: "juwon-portfolio.firebasestorage.app",
      messagingSenderId: "238515018176",
      appId: "1:238515018176:web:00fbc29ef97df12af71025",
      measurementId: "G-RX67W5HTN3"
  };
  // Firebase 초기화
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();

  let adminLoggedIn = false;
  let unsubscribe = null; // 실시간 구독을 위한 변수

  // =====================
  // 1) 부드러운 스크롤 기능
  // =====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function(e) {
          e.preventDefault();
          document.querySelector(this.getAttribute("href")).scrollIntoView({
              behavior: "smooth"
          });
          // 모바일 메뉴가 열려있으면 닫기
          const navMenu = document.querySelector("nav ul");
          if (navMenu.classList.contains("active")) {
              navMenu.classList.remove("active");
          }
      });
  });

  // =====================
  // 2) 모바일 메뉴 토글
  // =====================
  const menuToggle = document.getElementById("mobile-menu");
  menuToggle.addEventListener("click", function() {
      const navMenu = document.querySelector("nav ul");
      navMenu.classList.toggle("active");
  });

  // =====================
  // 3) 전역 툴팁 div 생성
  // =====================
  const tooltipDiv = document.createElement('div');
  tooltipDiv.classList.add('custom-tooltip');
  document.body.appendChild(tooltipDiv);

  // =====================
  // 4) 아코디언 기능 + 툴팁 처리
  // =====================
  const accordionHeaders = document.querySelectorAll(".accordion-header");
  accordionHeaders.forEach(header => {
      header.addEventListener("click", function() {
          const content = this.nextElementSibling;
          content.style.display = (content.style.display === 'block') ? 'none' : 'block';
          tooltipDiv.textContent = (content.style.display === 'block') ? '접기' : '펼쳐보기';
      });
      header.addEventListener('mouseover', function() {
          const content = this.nextElementSibling;
          tooltipDiv.textContent = (content.style.display === 'block') ? '접기' : '펼쳐보기';
          tooltipDiv.style.display = 'block';
      });
      header.addEventListener('mousemove', function(e) {
          const offset = 10;
          tooltipDiv.style.left = (e.pageX + offset) + 'px';
          tooltipDiv.style.top = (e.pageY + offset) + 'px';
      });
      header.addEventListener('mouseout', function() {
          tooltipDiv.style.display = 'none';
      });
  });

  // =====================
  // 5) 해시 링크( # ) 툴팁
  // =====================
  document.querySelectorAll('.hash-link').forEach(link => {
      link.addEventListener('mouseover', function() {
          tooltipDiv.textContent = '포트폴리오 둘러보기';
          tooltipDiv.style.display = 'block';
      });
      link.addEventListener('mousemove', function(e) {
          const offset = 10;
          tooltipDiv.style.left = (e.pageX + offset) + 'px';
          tooltipDiv.style.top = (e.pageY + offset) + 'px';
      });
      link.addEventListener('mouseout', function() {
          tooltipDiv.style.display = 'none';
      });
  });

  // =====================
  // 6) 프로젝트 카드 툴팁
  // =====================
  document.querySelectorAll('.project-card a').forEach(card => {
      card.addEventListener('mouseover', function() {
          tooltipDiv.textContent = '자세히 보기';
          tooltipDiv.style.display = 'block';
      });
      card.addEventListener('mousemove', function(e) {
          const offset = 10;
          tooltipDiv.style.left = (e.pageX + offset) + 'px';
          tooltipDiv.style.top = (e.pageY + offset) + 'px';
      });
      card.addEventListener('mouseout', function() {
          tooltipDiv.style.display = 'none';
      });
  });

  // =====================
  // 7) 이메일, 버튼 툴팁
  // =====================
  document.querySelectorAll('.github-btn, .linkedin-btn').forEach(el => {
      el.addEventListener('mouseover', function() {
          tooltipDiv.textContent = this.getAttribute('data-tooltip') || '이동하기';
          tooltipDiv.style.display = 'block';
      });
      el.addEventListener('mousemove', function(e) {
          const offset = 10;
          tooltipDiv.style.left = (e.pageX + offset) + 'px';
          tooltipDiv.style.top = (e.pageY + offset) + 'px';
      });
      el.addEventListener('mouseout', function() {
          tooltipDiv.style.display = 'none';
      });
  });

  // =====================
  // 8) 스크롤 이벤트: 상단바 처리. 화면 상단에 있을 때는 숨기고, 스크롤 내리면 나타나도록 함
  // =====================
  window.addEventListener("scroll", function() {
      const header = document.querySelector("header");
      if (window.scrollY > 0) {
          header.classList.add("scrolled");
      } else {
          header.classList.remove("scrolled");
      }
  });

  // =====================
  // 9) scroll-modal (두 단계 인터랙션: 스크롤 + 모달 열기 (scroll-modal 클래스 적용))
  // =====================
  document.querySelectorAll(".scroll-modal").forEach(function(link) {
      link.addEventListener("click", function(e) {
          e.preventDefault();
          // 1단계: 지정된 대상 요소로 스크롤 (화면 높이의 1/3 지점에 위치)
          var targetSelector = this.getAttribute("data-target");
          if (targetSelector) {
              var targetElement = document.querySelector(targetSelector);
              if (targetElement) {
				  // 요소의 Y 좌표 (문서 상의 위치)
                  var elementY = targetElement.getBoundingClientRect().top + window.pageYOffset;
                  // 화면 높이의 1/3 만큼 오프셋
                  var offset = window.innerHeight / 3;
                  // 해당 요소가 화면 상단에 오지 않고, 1/3 지점에 위치하도록 스크롤
                  window.scrollTo({ top: elementY - offset, behavior: "smooth" });
              }
          }
          // 2단계: 일정 시간 지연 후 모달 열기
          var modalId = this.getAttribute("data-modal");
          setTimeout(function() {
              document.getElementById(modalId).style.display = "flex";
          }, 800);
      });
  });

  // =====================
  // 10) open-modal (프로젝트 카드 등)
  // =====================
  document.querySelectorAll(".open-modal").forEach(function(btn) {
      btn.addEventListener("click", function() {
          // 만약 해당 요소에 scroll-modal 클래스가 없으면 바로 모달 열기
          if (!this.classList.contains("scroll-modal")) {
              var modalId = this.getAttribute("data-modal");
              document.getElementById(modalId).style.display = "flex";
          }
      });
  });

  // =====================
  // 11) 모달 닫기 로직을 함수화
  // =====================
  function bindCloseButtons() {
    document.querySelectorAll(".close").forEach(function(btn) {
      btn.addEventListener("click", function() {
        this.closest(".modal").style.display = "none";
      });
    });
  };

  // =====================
  // 12) 초기에 한 번 bindCloseButtons() 호출
  // =====================
  bindCloseButtons();

  // =====================
  // 13) 모달 바깥 클릭 시 닫기
  // =====================
  window.addEventListener("click", function(e) {
      document.querySelectorAll(".modal").forEach(function(modal) {
          if (e.target === modal) {
              modal.style.display = "none";
              e.preventDefault();          /* UPDATED */
              e.stopPropagation();         /* UPDATED */
          }
      });
  });

  // 모달 외부 터치 시 닫기 (모바일)
  window.addEventListener("touchend", function(e) {
    document.querySelectorAll(".modal").forEach(function(modal) {
      if (e.target === modal) {
        modal.style.display = "none";
        e.preventDefault();          /* UPDATED */
        e.stopPropagation();         /* UPDATED */
      }
    });
  });

  // 모달 내부 클릭 시 이벤트 전파 막기
  document.querySelectorAll(".modal-content").forEach(function(content) {
    content.addEventListener("click", function(e) {
      e.stopPropagation();
    });
    content.addEventListener("touchend", function(e) {   /* UPDATED: 터치 이벤트 추가 */
      e.stopPropagation();
    });
  });

  // =====================
  // 14) 문의 폼 제출 (Firestore에 문의 내용 저장)
  // =====================
  const inquiryForm = document.querySelector('.inquiry-form');
  inquiryForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;

      db.collection('inquiries').add({
          name: name,
          email: email,
          subject: subject,
          message: message,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).then(function(docRef) {
          alert("문의가 제출되었습니다.");
          inquiryForm.reset();
      }).catch(function(error) {
          console.error("문의 저장 중 오류 발생: ", error);
          alert("오류가 발생했습니다. 콘솔을 확인해보세요.");
      });
  });

  // =====================
  // 15) 관리자 문의 목록 렌더링
  // =====================
  function renderInquiries(snapshot) {
      const adminInquiriesDiv = document.getElementById('admin-inquiries');
      let html = "<h3>Inquiry List</h3>";
      snapshot.forEach(doc => {
          const inquiry = doc.data();
          html += `
      <div class="inquiry-item" id="inquiry-${doc.id}">
        <p><strong>Name:</strong> ${inquiry.name}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        <p><strong>Subject:</strong> ${inquiry.subject}</p>
        <p><strong>Message:</strong> ${inquiry.message}</p>
        <button class="delete-btn" data-id="${doc.id}">Delete</button>
        <hr>
      </div>
    `;
      });
      adminInquiriesDiv.innerHTML = html;
      // 삭제 버튼 이벤트 추가
      document.querySelectorAll('.delete-btn').forEach(btn => {
          btn.addEventListener('click', function() {
              const docId = this.getAttribute('data-id');
              if (confirm('정말 삭제하시겠습니까?')) {
                  db.collection('inquiries').doc(docId).delete().then(function() {
                      alert('문의가 삭제되었습니다.');
                      // onSnapshot이 자동으로 업데이트를 반영하므로 별도 삭제 처리 불필요
                  }).catch(function(error) {
                      console.error("삭제 중 오류 발생: ", error);
                      alert('삭제 중 오류가 발생했습니다.');
                  });
              }
          });
      });
  }

  // =====================
  // 16) 관리자 로그인 및 실시간 구독
  // =====================
  document.getElementById('admin-login-btn').addEventListener('click', function() {
      const password = prompt("관리자 비밀번호를 입력하세요:");
      // 데모용 비밀번호 (실제 사용 시 안전한 인증 시스템 필요)
      if (password === "123") {
          adminLoggedIn = true;
          // 실시간 구독 시작: 문의 컬렉션에 변경사항이 있으면 renderInquiries 호출
          unsubscribe = db.collection('inquiries').orderBy('timestamp', 'desc')
              .onSnapshot(snapshot => {
                  renderInquiries(snapshot);
                  document.getElementById('admin-inquiries').style.display = "block";
              });
      } else {
          alert("잘못된 비밀번호입니다.");
      }
  });

  // =====================
  // 17) 뒤로가기 복원 시 모달 열림 & .close 재바인딩
  // =====================
  window.addEventListener('pageshow', function() {
    if (localStorage.getItem('openModal') === 'true') {
      document.getElementById('modal-ai-sw').style.display = 'flex';
      localStorage.removeItem('openModal');
    }
    // bfcache 복원 시점에 다시 .close 이벤트 바인딩
    bindCloseButtons();
  });

  // 이미지 확대 기능
  const images = document.querySelectorAll('.project-outcomes img');
  const modal = document.getElementById('imgModal');
  const modalImg = document.getElementById('expandedImg');
  const captionText = document.getElementById('imgCaption');
  const closeBtn = document.querySelector('.close-img');

  images.forEach(img => {
    img.style.cursor = 'pointer'; // 마우스 포인터 변경
    img.onclick = function() {
    modal.style.display = 'block';
    modalImg.src = this.src;
    captionText.innerHTML = this.alt; // 이미지 alt 텍스트를 캡션으로 사용
    };
  });

  closeBtn.onclick = function() {
    modal.style.display = 'none';
  };

  modal.onclick = function(e) {
    if (e.target === modal) {
    modal.style.display = 'none';
    }
  };
});
