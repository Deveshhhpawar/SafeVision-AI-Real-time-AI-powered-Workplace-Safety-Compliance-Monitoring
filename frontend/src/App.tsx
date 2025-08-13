import React, { useState, useRef } from 'react'
import {
  Box,
  Typography,
  Button,
  Stack,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Paper
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import type { InferenceResponse, Detection } from './types'

const API_URL = 'http://localhost:8000/infer'

function drawBoxes(canvas: HTMLCanvasElement, img: HTMLImageElement, detections: Detection[]) {
  const ctx = canvas.getContext('2d')!
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  ctx.drawImage(img, 0, 0)
  ctx.lineWidth = 2
  ctx.font = '14px sans-serif'
  ctx.textBaseline = 'top'

  detections.forEach(d => {
    const { x_min, y_min, x_max, y_max } = d.box
    ctx.strokeStyle = '#ff0000'
    ctx.strokeRect(x_min, y_min, x_max - x_min, y_max - y_min)
    const text = `${d.label} ${(d.score * 100).toFixed(1)}%`
    const textWidth = ctx.measureText(text).width
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillRect(x_min, Math.max(y_min - 18, 0), textWidth + 6, 18)
    ctx.fillStyle = '#fff'
    ctx.fillText(text, x_min + 3, Math.max(y_min - 18, 0) + 2)
  })
}

export default function App() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [detections, setDetections] = useState<Detection[]>([])
  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null
    setFile(f)
    setDetections([])
    if (imgRef.current && f) {
      imgRef.current.src = URL.createObjectURL(f)
    }
  }

  const onInfer = async () => {
    if (!file) return
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch(API_URL, { method: 'POST', body: fd })
      const data: InferenceResponse = await res.json()
      setDetections(data.detections)
      if (imgRef.current && canvasRef.current) {
        if (imgRef.current.complete) {
          drawBoxes(canvasRef.current, imgRef.current, data.detections)
        } else {
          imgRef.current.onload = () => {
            if (canvasRef.current && imgRef.current) {
              drawBoxes(canvasRef.current, imgRef.current, data.detections)
            }
          }
        }
      }
    } catch (e) {
      console.error(e)
      alert('Inference failed. Is the backend running on port 8000?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 4, fontFamily: 'Inter, system-ui, Arial' }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        SafeVision AI – PPE/Object Detection (MVP)
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Upload an image and run object detection via the FastAPI backend.
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" mb={4}>
        <Button variant="outlined" component="label">
          Choose Image
          <input type="file" accept="image/*" hidden onChange={onFileChange} />
        </Button>
        <LoadingButton
          variant="contained"
          onClick={onInfer}
          loading={loading}
          disabled={!file}
        >
          Run Detection
        </LoadingButton>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Image" />
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <img ref={imgRef} alt="preview" style={{ maxWidth: '100%', display: 'block' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Detections" />
            <CardContent>
              <canvas
                ref={canvasRef}
                style={{ maxWidth: '100%', border: '1px solid #ddd' }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h6">JSON Output</Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mt: 1,
            backgroundColor: '#f6f6f6',
            borderRadius: 2,
            maxHeight: 240,
            overflow: 'auto'
          }}
        >
          <pre style={{ margin: 0 }}>
            {JSON.stringify(detections, null, 2)}
          </pre>
        </Paper>
      </Box>
    </Box>
  )
}
