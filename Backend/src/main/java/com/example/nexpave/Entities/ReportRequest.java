package com.example.nexpave.Entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportRequest {
    private String location;
    private String latitude;
    private String longitude;
    private String description;
    private MultipartFile potholeImage;
}
