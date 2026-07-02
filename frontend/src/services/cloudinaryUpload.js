const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export function uploadAvatar() {
  return new Promise((resolve, reject) => {
    if (!window.cloudinary) {
      reject(new Error('Cloudinary Upload Widget no esta cargado.'))
      return
    }

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      reject(new Error('Configura VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET.'))
      return
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        resourceType: 'image',
        folder: 'pc3/talent-match/avatars',
        cropping: true,
        croppingAspectRatio: 1,
      },
      (error, result) => {
        if (error) {
          reject(new Error('No se pudo subir el avatar.'))
          return
        }

        if (result?.event === 'success') {
          resolve(result.info.secure_url)
        }
      },
    )

    widget.open()
  })
}
