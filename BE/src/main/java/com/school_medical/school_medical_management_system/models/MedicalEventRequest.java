package com.school_medical.school_medical_management_system.models;

import java.util.List;

public class MedicalEventRequest {
    private String eventType;
    private String eventDate;  // ISO date string
    private String description;
    private Long studentId;
    private Long nurseId;
    private String status;
    private List<MedicalEventSupplyRequest> supplies;

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getEventDate() { return eventDate; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Long getNurseId() { return nurseId; }
    public void setNurseId(Long nurseId) { this.nurseId = nurseId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<MedicalEventSupplyRequest> getSupplies() { return supplies; }
    public void setSupplies(List<MedicalEventSupplyRequest> supplies) { this.supplies = supplies; }

    public static class MedicalEventSupplyRequest {
        private Integer supplyId;
        private Integer quantityUsed;

        public Integer getSupplyId() { return supplyId; }
        public void setSupplyId(Integer supplyId) { this.supplyId = supplyId; }

        public Integer getQuantityUsed() { return quantityUsed; }
        public void setQuantityUsed(Integer quantityUsed) { this.quantityUsed = quantityUsed; }
    }
}
