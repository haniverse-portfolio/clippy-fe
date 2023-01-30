interface ILoginedUserInfo {
  createdAt: string;
  deletedAt: string | null;
  email: string | null;
  id: number;
  isDeleted: 0 | 1;
  offlineImageUrl: string;
  profileImageUrl: string;
  twitchAccessToken: string;
  twitchBroadcasterType: string;
  twitchCreatedAt: string;
  twitchDescription: string;
  twitchDisplayName: string;
  twitchId: number;
  twitchName: string;
  twitchRefreshToken: string;
  twitchType: string;
  updatedAt: string;
}

interface IClipInfo {
  cfVideoId: string;
  cfVideoThumbnail: string;
  commentCount: number;
  createUserId: number;
  createdAt: string;
  created_at: string;
  deleteDescription: string | null;
  deletedAt: string | null;
  description: string | null;
  ends: number;
  id: number;
  isDeleted: 0 | 1;
  key: string;
  likeCount: number;
  originalClipId: string;
  starts: number;
  targetUserId: number;
  title: string;
  updatedAt: string;
  updated_at: string;
  isAdult?: number;
  userInfo: {
    broadcaster_type: string;
    created_at: string;
    description: string;
    display_name: string;
    id: string;
    login: string;
    offline_image_url: string;
    profile_image_url: string;
    type: string;
    view_count: number;
  };
  videoDuration: number;
  viewCount: number;
  isLegacy: boolean;
  legacyInfo?: any;
}

interface ITwitchUserInfo {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: string;
}

/**
 * 팔로우한 스트리머의 정보 Interface
 */
interface ILiveStreamerInfo {
  game_id: string;
  game_name: string;
  id: string;
  is_mature: boolean;
  language: string;
  profile_image_url: string;
  started_at: string;
  tag_ids: string[];
  tags: string[];
  thumbnail_url: string;
  title: string;
  type: string;
  user_id: string;
  user_login: string;
  user_name: string;
  viewer_count: number;
}

/**
 * 클립을 생성할 스트리머 정보 Interface
 */
interface ICreateClipStreamerInfo {
  id: number;
  login: string;
  name: string;
  image: string;
}

/**
 * 클립생성 오류 상태 Interface
 */
interface ICreateClipModalError {
  msg: string;
  statusCode: number;
}

/**
 * 생성할 클립 정보 Interface
 */
interface ICreateClipInfo {
  requestId: string;
  starts: number;
  ends: number;
  title: string;
}

/**
 * 클립을 생성할 라이브 비디오 정보 Interface
 */
interface ILiveVideoInfo {
  thumbnailUrl: string;
  rawMediaUrl: string;
  requestId: string;
  clip: {
    clipId: string;
    editUrl: string;
  };
}

/**
 * 마이페이지 클립 정보
 */
interface IMypageClip {
  info: string;
  clipId: string;
  thumbnail: string;
  channel: string;
  channelId: number;
  channelName: string;
  date: string;
  views: string;
}

/**
 * 채널검색 결과 Interface
 */
interface ISearchChannelInfo {
  display_name: string;
  id: string;
  logo: string;
  name: string;
  url: string;
}

/**
 * 댓글 정보 Interface
 */
interface IComments {
  commentId: number;
  clipId: string;
  comment: string;
  userId: number;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
