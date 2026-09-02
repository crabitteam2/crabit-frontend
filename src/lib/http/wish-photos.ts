import type { components, operations } from "./generated/crabit-backend";
import { apiResult, type ApiResult } from "./result";
import type { CrabitApiClient } from "./wishes";

/** 위시 사진 업로드에 필요한 멱등성 키와 JPEG 파일입니다. */
export interface UploadWishPhotoOptions {
  /** 같은 사진 재시도에 계속 사용하는 학생 범위 멱등성 키입니다. */
  readonly idempotencyKey: components["parameters"]["IdempotencyKey"];
  /** 정확히 1080x1080으로 준비한 JPEG 파일입니다. */
  readonly photo: File;
}

/** 아직 위시에 붙지 않은 Pending 사진을 취소할 때 필요한 식별자입니다. */
export interface DeletePendingWishPhotoOptions {
  /** 취소할 Pending 사진의 opaque 식별자입니다. */
  readonly photoId: components["parameters"]["WishPhotoId"];
}

/**
 * JPEG 한 장을 multipart body로 감싸 업로드합니다.
 *
 * FormData가 Content-Type boundary를 만들도록 헤더를 직접 지정하지 않습니다.
 */
export function uploadWishPhoto(
  client: CrabitApiClient,
  options: UploadWishPhotoOptions,
): Promise<ApiResult<components["schemas"]["WishPhoto"]>> {
  return apiResult<components["schemas"]["WishPhoto"]>(() =>
    client.POST("/v1/wish-photos", {
      params: {
        header: { "Idempotency-Key": options.idempotencyKey },
      },
      body: {
        // openapi-typescript represents binary parts as string even though the
        // browser boundary is a File. The serializer below is the wire truth.
        photo: options.photo as unknown as string,
      },
      bodySerializer: multipartWishPhotoBody,
    }),
  );
}

/** 소유한 미첨부 Pending 사진을 명시적으로 취소합니다. */
export function deletePendingWishPhoto(
  client: CrabitApiClient,
  options: DeletePendingWishPhotoOptions,
): Promise<ApiResult<void>> {
  return apiResult<void>(() =>
    client.DELETE("/v1/wish-photos/{photoId}", {
      params: { path: { photoId: options.photoId } },
    }),
  );
}

function multipartWishPhotoBody(
  body: operations["uploadWishPhoto"]["requestBody"]["content"]["multipart/form-data"],
) {
  const data = new FormData();
  data.append("photo", body.photo as unknown as Blob, "wish-photo.jpg");
  return data;
}
