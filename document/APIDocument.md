# MyPli API 설계

작성 일시: 2024년 12월 10일
작성자: [4기-a] 김난영, [4기-a] 조성민
## 1. 회원 관련

### 회원가입
**Endpoint:** `POST /auth/signup`  
**설명:** 이메일과 비밀번호와 닉네임을 사용하여 회원가입을 진행.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "UserNickname"
}
```

**Response:**  
**성공:**
```json
{
  "message": "회원가입에 성공했습니다",
  "userId": 1
}
```

**실패:**
- 400: 요청 데이터가 잘못된 경우.
- 409: 이미 존재하는 이메일.

**HTTP 상태 코드:**
- 201: Created
- 400: Bad Request
- 409: Conflict

---

### 로그인
**Endpoint:** `POST /auth/login`  
**설명:** 이메일과 비밀번호를 사용하여 로그인.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**  
**성공:**
```json
{
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

**실패:**
- 401: 인증 실패 (잘못된 이메일/비밀번호).

**HTTP 상태 코드:**
- 200: OK
- 401: Unauthorized

---

### 구글 소셜 로그인
**Endpoint:** `POST /auth/google`  
**설명:** 구글 계정을 사용하여 로그인.

**Request:**
```json
{
  "idToken": "google-id-token"
}
```

**Response:**
```json
{
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

**HTTP 상태 코드:**
- 200: OK
- 401: Unauthorized

---

### 현재 사용자 정보 조회
**Endpoint:** `GET /users/me`  
**설명:** 현재 로그인된 사용자의 정보를 반환.

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "nickname": "UserNickname",
  "profileImage": "https://example.com/image.png"
}
```

**HTTP 상태 코드:**
- 200: OK
- 401: Unauthorized

---

### 프로필 수정
**Endpoint:** `PATCH /users/me`  
**설명:** 닉네임 및 프로필 이미지를 수정.

**Request:**
```json
{
  "nickname": "NewNickname",
  "profileImage": "https://example.com/new-image.png"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully"
}
```

**HTTP 상태 코드:**
- 200: OK
- 400: Bad Request
- 401: Unauthorized

---
## **2. 플레이리스트 관련**

- **플레이리스트 생성**
    - **Endpoint**: `POST /playlists`
    - **HTTP 메서드**: POST
    - **설명**: 새로운 플레이리스트를 생성.
    - **Request**:

        ```json
        
        {
          "title": "My Playlist",
          "description": "공부할 때 듣기 좋은 음악",
          "tags": ["공부", "집중"]
        }
        ```

    - **Response**:

        ```json
        
        {
          "id": 1,
          "title": "My Playlist",
          "description": "공부할 때 듣기 좋은 음악",
          "tags": ["공부", "집중"],
          "message": "플레이리스트 생성 성공"
        }
        ```

    - **Error Codes**:
        - `400 Bad Request`: 필수 데이터 누락 (예: 제목, 태그)
        - `401 Unauthorized`: 인증 토큰 없음

---

- **플레이리스트 곡 추가**
    - **Endpoint**: `POST /playlists/{id}/videos`
    - **HTTP 메서드**: POST
    - **설명**: 기존 플레이리스트에 곡(비디오)를 추가.
    - **Request**:

        ```json
        
        {
          "title": "노래 제목",
          "url": "https://youtube.com/watch?v=example"
        }
        
        ```

    - **Response**:

        ```json
        {
          "playlistId": 1,
          "videoId": 101,
          "title": "노래 제목",
          "url": "https://youtube.com/watch?v=example",
          "message": "곡 추가 성공",
          "order" : 1
        }
        ```

    - **Error Codes**:
        - `400 Bad Request`: 필수 데이터 누락 (예: 제목, URL)
        - `404 Not Found`: 플레이리스트를 찾을 수 없음
        - `401 Unauthorized`: 인증 토큰 없음

---

- **플레이리스트 곡 제거**
    - **Endpoint**: `DELETE /playlists/{id}/videos/{videoId}`
    - **HTTP 메서드**: DELETE
    - **설명**: 플레이리스트에서 특정 곡(비디오)을 제거.
    - **Request**: (URL 매개변수에 `id`와 `videoId` 포함)
    - **Response**:

        ```json
        {
          "playlistId": 1,
          "videoId": 101,
          "message": "곡 제거 성공"
        }
        ```

    - **Error Codes**:
        - `404 Not Found`: 곡 또는 플레이리스트를 찾을 수 없음
        - `401 Unauthorized`: 인증 토큰 없음

---

- **플레이리스트 상세 조회**
    - **Endpoint**: `GET /playlists/{id}`
    - **HTTP 메서드**: GET
    - **설명**: 특정 플레이리스트의 상세 정보를 가져옴.
    - **Response**:

        ```json
        {
          "id": 1,
          "title": "My Playlist",
          "description": "공부할 때 듣기 좋은 음악",
          "tags": ["공부", "집중"],
          "videos": [
            {
              "id": 101,
              "title": "노래 제목",
              "url": "https://youtube.com/watch?v=example"
            },
            {
              "id": 102,
              "title": "다른 노래 제목",
              "url": "https://youtube.com/watch?v=example2"
            }
          ]
        }
        ```

    - **Error Codes**:
        - `404 Not Found`: 플레이리스트를 찾을 수 없음

---

- **플레이리스트 수정**
    - **Endpoint**: `PATCH /playlists/{id}`
    - **HTTP 메서드**: PATCH
    - **설명**: 플레이리스트 제목, 설명, 태그 등을 수정.
    - **Request**:

        ```json
        {
          "title": "Updated Playlist Title",
          "description": "업데이트된 설명",
          "tags": ["업데이트", "새로운 태그"]
        }
        ```

    - **Response**:

        ```json
        {
          "id": 1,
          "title": "Updated Playlist Title",
          "description": "업데이트된 설명",
          "tags": ["업데이트", "새로운 태그"],
          "message": "플레이리스트 수정 성공"
        }
        ```

    - **Error Codes**:
        - `400 Bad Request`: 필수 데이터 누락
        - `404 Not Found`: 플레이리스트를 찾을 수 없음
        - `401 Unauthorized`: 인증 토큰 없음

---

- **플레이리스트 삭제**
    - **Endpoint**: `DELETE /playlists/{id}`
    - **HTTP 메서드**: DELETE
    - **설명**: 특정 플레이리스트를 삭제.
    - **Request**: (URL 매개변수에 `id` 포함)
    - **Response**:

        ```json
        {
          "id": 1,
          "message": "플레이리스트 삭제 성공"
        }
        ```

    - **Error Codes**:
        - `404 Not Found`: 플레이리스트를 찾을 수 없음
        - `401 Unauthorized`: 인증 토큰 없음

---

- **메인페이지에서 보여질 플레이리스트(인기순)**
  - **Endpoint**: ` GET /playlists/popular`
  - **HTTP 메서드**: GET
  - **설명**:  서비스에서 좋아요 수가 많은 상위 인기 플레이리스트를 반환합니다.
  - **Query Parameter**: limit (optional): 반환할 플레이리스트 개수. 기본값은 5.
  - **Request**: `GET /playlists/popular?limit=5`
  - **Response**:

      ```json
      {
        "playlists": [
          {
            "id": 1,
            "title": "뉴진스 플레이리스트",
            "description": "최고의 뉴진스 곡 모음",
            "likesCount": 1234,
            "coverImage": "https://example.com/image.jpg",
            "createdAt": "2024-12-01T10:00:00Z"
          },
          {
            "id": 2,
            "title": "MAMA 대상! 에스파 플레이리스트",
            "description": "에스파 인기곡 모음",
            "likesCount": 980,
            "coverImage": "https://example.com/image.jpg",
            "createdAt": "2024-11-29T10:00:00Z"
          }
        ]
      }
      ```
---

- **메인페이지에서 보여질 플레이리스트(최신순)**
  - **Endpoint**: ` GET /playlists/latest`
  - **HTTP 메서드**: GET
  - **설명**:  서비스에서 가장 최근에 생성된 플레이리스트를 반환합니다.
  - **Query Parameter**: limit (optional): 반환할 플레이리스트 개수. 기본값은 5.
  - **Request**: `GET /playlists/latest?limit=5`
  - **Response**:

      ```json
      {
        "playlists": [
          {
            "id": 3,
            "title": "슬슬 연말 분위기를 내볼까요",
            "description": "퍼펙트 크리스마스 캐롤 플레이리스트",
            "likesCount": 340,
            "coverImage": "https://example.com/image.jpg",
            "createdAt": "2024-12-09T14:00:00Z"
          },
          {
            "id": 4,
            "title": "방구석을 클럽으로! EDM 플레이리스트",
            "description": "신나는 EDM 음악 모음",
            "likesCount": 200,
            "coverImage": "https://example.com/image.jpg",
            "createdAt": "2024-12-08T12:00:00Z"
          }
        ]
      }
      ```
---
### **요약**

| **기능** | **HTTP 메서드** | **엔드포인트** | **설명** |
| --- | --- | --- | --- |
| 플레이리스트 생성 | POST | /playlists | 새로운 플레이리스트 생성 |
| 플레이리스트 곡 추가 | POST | /playlists/{id}/videos | 플레이리스트에 곡(비디오) 추가 |
| 플레이리스트 곡 제거 | DELETE | /playlists/{id}/videos/{videoId} | 플레이리스트에서 특정 곡 제거 |
| 플레이리스트 상세 조회 | GET | /playlists/{id} | 특정 플레이리스트 상세 정보 조회 |
| 플레이리스트 수정 | PATCH | /playlists/{id} | 플레이리스트 제목, 설명, 태그 수정 |
| 플레이리스트 삭제 | DELETE | /playlists/{id} | 특정 플레이리스트 삭제 |
| 플레이리스트 인기순 정렬| GET| /playlists/popular?limit=5| 메인페이지에서 사용할 인기 플레이리스트|
| 플레이리스트 최신순 정렬| GET| /playlists/latest?limit=5| 메인페이지에서 사용할 최신 플레이리스트|

---

## **3. 좋아요 관련**

- **좋아요 추가**
    - **Endpoint**: `POST /playlists/{id}/like`
    - **HTTP 메서드**: POST
    - **설명**: 특정 플레이리스트에 좋아요를 추가
    - **Request**: (헤더에 인증 토큰 포함)
        - URL 매개변수:
            - `id`: 플레이리스트 ID
    - **Response**:

        ```json
        {
          "message": "플레이리스트에 좋아요를 추가했습니다."
        }
        ```

    - **Error Codes**:
        - `401 Unauthorized`: 인증 토큰 없음
        - `404 Not Found`: 플레이리스트가 존재하지 않음
        - `409 Conflict`: 이미 좋아요를 누른 경우

---

- **좋아요 해제**
    - **Endpoint**: `DELETE /playlists/{id}/like`
    - **HTTP 메서드**: DELETE
    - **설명**: 특정 플레이리스트에 추가된 좋아요를 해제.
    - **Request**: (헤더에 인증 토큰 포함)
        - URL 매개변수:
            - `id`: 플레이리스트 ID
    - **Response**:

        ```json
        {
          "message": "플레이리스트에 대한 좋아요를 해제했습니다."
        }
        
        ```

    - **Error Codes**:
        - `401 Unauthorized`: 인증 토큰 없음
        - `404 Not Found`: 플레이리스트가 존재하지 않음
        - `409 Conflict`: 좋아요가 이미 해제된 경우

---

- **좋아요 리스트 조회**
    - **Endpoint**: `GET /users/me/likes`
    - **HTTP 메서드**: GET
    - **설명**: 현재 사용자가 좋아요를 누른 플레이리스트 목록을 가져옴.
    - **Request**: (헤더에 인증 토큰 포함)
    - **Response**:

        ```json
        [
          {
            "id": 1,
            "title": "My Playlist",
            "description": "공부할 때 듣기 좋은 음악",
            "tags": ["공부", "집중"]
          },
          {
            "id": 2,
            "title": "Chill Vibes",
            "description": "휴식을 위한 음악",
            "tags": ["휴식", "편안함"]
          }
        ]
        
        ```

    - **Error Codes**:
        - `401 Unauthorized`: 인증 토큰 없음
        - `404 Not Found`: 좋아요한 플레이리스트가 없을 때

---

### 요약

| **기능** | **HTTP 메서드** | **엔드포인트** | **설명** |
| --- | --- | --- | --- |
| 좋아요 추가 | POST | /playlists/{id}/like | 특정 플레이리스트에 좋아요 추가 |
| 좋아요 해제 | DELETE | /playlists/{id}/like | 특정 플레이리스트의 좋아요 해제 |
| 좋아요 리스트 조회 | GET | /users/me/likes | 사용자가 좋아요를 누른 플레이리스트 조회 |
---

## **4. 내 플레이리스트**
  - **내 플레이리스트 정렬**
   - **Endpoint**: `GET /users/me/playlists`
   - **HTTP 메서드**: GET
   - **설명**: 현재 사용자의 플레이리스트를 정렬 옵션에 따라 반환합니다.
   - **Query Parameter**
     - sort:
        - alphabetical: 가나다순.
        - latest: 최신순 (기본값).
  - **Request**: (헤더에 인증 토큰 포함) `GET /users/me/playlists?sort=alphabetical`
  
  - **Response**:

      ```json
      {
        "playlists": [
          {
            "id": 5,
            "title": "가나다순 플레이리스트",
            "description": "한국 시티 팝 곡 모음",
            "likesCount": 150,
            "coverImage": "https://example.com/image.jpg",
            "createdAt": "2024-12-07T10:00:00Z"
          },
          {
            "id": 6,
            "title": "쇠맛의 제왕 에스파 플레이리스트",
            "description": "에스파 명곡 모음",
            "likesCount": 90,
            "coverImage": "https://example.com/image.jpg",
            "createdAt": "2024-12-06T15:00:00Z"
          }
        ]
      }

      ```

  - **Error Codes**:
      - `401 Unauthorized`: 인증 토큰 없음
      - `404 Not Found`: 정렬할 플레이리스트가 없을떄
  ---
  - **내 플레이리스트 조회**
   - **Endpoint**: `GET /users/{userId}/playlists`
   - **HTTP 메서드**: GET
   - **설명**: 특정 사용자가 생성한 모든 플레이리스트를 반환합니다..
  - **Request**: (헤더에 인증 토큰 포함) `GET /users/123/playlists`
  
  - **Response**:

      ```json
       "playlists": [
        {
          "id": 1,
          "title": "가나다 플레이리스트",
          "description": "좋은 곡들을 모아둔 플레이리스트",
          "likesCount": 45,
          "coverImage": "https://example.com/image1.jpg",
          "createdAt": "2024-12-01T10:00:00Z"
        },
        {
          "id": 2,
          "title": "두번째 플레이리스트",
          "description": "다양한 장르의 노래",
          "likesCount": 32,
          "coverImage": "https://example.com/image2.jpg",
          "createdAt": "2024-11-25T12:00:00Z"
        }
      ]

      ```

  - **Error Codes**:
      - `401 Unauthorized`: 인증 토큰 없음
      - `404 Not Found`: 정렬할 플레이리스트가 없을떄  
---


## **5. 검색 관련**
- 검색 기능은 서비스에서 제공하고 있는 플레이리스트 제목과 유튜브 API를 활용한 플레이리스트를 검색하여 제공합니다
- **플레이리스트 검색**
    - **Endpoint**: `GET /search`
    - **HTTP 메서드**: GET
    - **Query Parameters**:
      - query (string): 검색 키워드.
      - **Request**: `GET /search?query=에스파`
        

      - **Response**:

        ```json
         {
            "servicePlaylists": [
             {
               "id": 1,
               "title": "에스파 플레이리스트",
               "description": "쇠맛 제대로 말아주는 에스파 노래모음",
               "coverImage": "https://example.com/image.png",
               "tags": ["에스파", "노래모음"],
               "source": "service"
             }
            ],
            "youtubePlaylists": [
             {
               "title": "에스파 유튜브 플레이리스트",
               "description": "에스파의 인기 유튜브 플레이리스트",
               "url": "https://www.youtube.com/watch?v=NRvBivvvz6Q",
               "thumbnail": "https://img.youtube.com/vi/NRvBivvvz6Q/default.jpg",
               "source": "youtube"
             }
            ]
          }

          ```

      - **Error Codes**:
          - `400 Bad Request`: 검색어 누락
          - `404 Not Found`: 검색 결과 없음
- --