export type Box = {
  x_min: number
  y_min: number
  x_max: number
  y_max: number
}

export type Detection = {
  label_id: number
  label: string
  score: number
  box: Box
}

export type InferenceResponse = {
  detections: Detection[]
}
