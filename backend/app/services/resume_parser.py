import os
import io
from fastapi import UploadFile, HTTPException
from pypdf import PdfReader
from docx import Document

class ResumeParserService:
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

    @staticmethod
    def extract_text(file: UploadFile) -> str:
        # Check size
        contents = file.file.read()
        if len(contents) > ResumeParserService.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail="Resume file exceeds the 10 MB size limit."
            )
        
        filename = (file.filename or "").lower()
        extracted_text = ""

        try:
            if filename.endswith(".pdf") or file.content_type == "application/pdf":
                pdf_file = io.BytesIO(contents)
                reader = PdfReader(pdf_file)
                num_pages = len(reader.pages)
                
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        extracted_text += page_text + "\n"
                        
                extracted_text = extracted_text.strip()
                if len(extracted_text) < 40 and num_pages > 0:
                    raise HTTPException(
                        status_code=400,
                        detail="The uploaded PDF appears to be a scanned image or empty. OCR is not enabled. Please upload a standard text PDF or DOCX file."
                    )

            elif filename.endswith(".docx") or "wordprocessingml" in (file.content_type or ""):
                docx_file = io.BytesIO(contents)
                doc = Document(docx_file)
                paragraphs = [p.text for p in doc.paragraphs if p.text]
                # Also check tables
                for table in doc.tables:
                    for row in table.rows:
                        for cell in row.cells:
                            if cell.text:
                                paragraphs.append(cell.text)
                extracted_text = "\n".join(paragraphs).strip()

            else:
                raise HTTPException(
                    status_code=400,
                    detail="Unsupported file format. Please upload a valid .pdf or .docx resume file."
                )

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to read and parse the resume document: {str(e)}"
            )

        if not extracted_text or len(extracted_text) < 30:
            raise HTTPException(
                status_code=400,
                detail="No readable text found in the resume. Please ensure the document is not password-protected, corrupt, or an empty scan."
            )

        return extracted_text

resume_parser_service = ResumeParserService()
