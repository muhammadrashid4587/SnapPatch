# 🩹 SnapPatch: AI-Powered 3D Wound Patch Generator

SnapPatch is an AI-driven web application that takes images of wounds, segments them (currently using a placeholder model), and generates 3D STL files of wound patches. Built for rapid prototyping with future plans to integrate trained ML models and 3D printing hardware.

## 🚀 Project Vision

Transform medical wound treatment by providing:
- Instant STL patch generation from wound images
- Seamless integration with future 3D printers
- Custom-fit, on-demand wound healing solutions

## 🛠️ Tech Stack

| Layer       | Tools Used                      |
|------------|----------------------------------|
| Frontend    | React, Tailwind CSS             |
| Backend     | FastAPI, Python                 |
| ML Model    | TensorFlow (planned)            |
| Image Proc. | OpenCV (planned)                |
| 3D Output   | STL Generator (custom module)   |
| Deployment  | Vercel (Frontend), Render (API) |

## 📦 Directory Structure

```
SnapPatch/
├── frontend/           # React UI for image upload & result view
├── backend/            # FastAPI server
│   └── ml/             # Placeholder ML pipeline
├── stl_generator/      # Converts image masks to STL files
└── docker-compose.yml  # (planned for full deployment)
```

## 🔄 Current Flow

1. 🖼️ Upload wound image via frontend.
2. 🧪 Backend runs placeholder segmentation (dummy mask).
3. 📐 Dummy mask fed to STL generator.
4. 📁 STL file returned to user for download.

## 🎯 Roadmap

- [x] Set up frontend & backend scaffolding
- [x] Implement dummy image mask system
- [x] Integrate STL generator
- [ ] Collect wound image dataset
- [ ] Train TensorFlow-based wound segmentation model
- [ ] Real-time patch fitting
- [ ] Connect to 3D printer APIs

## 🧠 Future Scope

- Precision medicine with custom healing patches
- Medical training simulators with wound models
- Global health deployment in remote clinics

## 🤝 Contributing

We’re in early-stage dev! To contribute:
1. Fork this repo
2. Create a feature branch
3. Commit and push changes
4. Open a PR

## 📄 License

MIT License

## 👤 Author

**Muhammad Rashid**  
GitHub: [@muhammadrashid4587](https://github.com/muhammadrashid4587)

---

*SnapPatch: Wounds don’t wait. Neither should healing.*
