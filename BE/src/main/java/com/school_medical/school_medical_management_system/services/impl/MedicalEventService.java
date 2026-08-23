package com.school_medical.school_medical_management_system.services.impl;

import com.school_medical.school_medical_management_system.models.ApprovalRequest;
import com.school_medical.school_medical_management_system.repositories.IMedicalEventRepository;
import com.school_medical.school_medical_management_system.repositories.IUserRepository;
import com.school_medical.school_medical_management_system.repositories.entites.MedicalEvent;
import com.school_medical.school_medical_management_system.services.IAppUserService;
import com.school_medical.school_medical_management_system.services.IMedicalEventService;
import com.school_medical.school_medical_management_system.utils.AuthUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicalEventService implements IMedicalEventService {

    @Autowired
    private IMedicalEventRepository medicalEventRepository;

    @Autowired
    private IAppUserService appUserService;

    @Override
    public List<MedicalEvent> getAllEvents() {
        return medicalEventRepository.getAllEvents();
    }

    @Override
    public MedicalEvent createEvent(MedicalEvent eventDTO) {
        medicalEventRepository.createEvent(eventDTO);
        return eventDTO;
    }

    @Override
    public MedicalEvent updateEvent(Long id, MedicalEvent eventDTO) {
        medicalEventRepository.updateEvent(id, eventDTO);
        return eventDTO;
    }

    @Override
    public MedicalEvent approveEvent(Long id, ApprovalRequest approvalRequest) {
        medicalEventRepository.approveEvent(id, approvalRequest);
        MedicalEvent dto = new MedicalEvent();
        dto.setEventId(id);
        dto.setApprovalStatus(approvalRequest.getApprovalStatus());
        dto.setApprovedBy(appUserService.getUserByEmail(AuthUtils.getCurrentUserEmail()).getId());
        return dto;
    }

    @Autowired
    private com.school_medical.school_medical_management_system.repositories.IMedicalEventSupplyRepository medicalEventSupplyRepository;

    @Autowired
    private com.school_medical.school_medical_management_system.repositories.IMedicalSupplyRepository medicalSupplyRepository;

    @Override
    public MedicalEvent getEventById(Long id) {
        return medicalEventRepository.getEventById(id); // Lấy sự kiện y tế theo ID
    }
    
    @Override
    public MedicalEvent createEventWithSupplies(com.school_medical.school_medical_management_system.models.MedicalEventRequest request) {
        // 1. Tạo MedicalEvent
        MedicalEvent event = new MedicalEvent();
        event.setEventType(request.getEventType());
        event.setEventDate(java.time.LocalDate.parse(request.getEventDate()));
        event.setDescription(request.getDescription());
        event.setStudentId(request.getStudentId());
        event.setNurseId(request.getNurseId());
        event.setStatus(request.getStatus() != null ? request.getStatus() : "Pending");
        
        event = medicalEventRepository.createEvent(event);
        
        // 2. Thêm supplies & trừ số lượng trong kho
        if (request.getSupplies() != null && !request.getSupplies().isEmpty()) {
            for (com.school_medical.school_medical_management_system.models.MedicalEventRequest.MedicalEventSupplyRequest supplyReq : request.getSupplies()) {
                // Kiểm tra kho
                com.school_medical.school_medical_management_system.repositories.entites.MedicalSupply supply = medicalSupplyRepository.findById(supplyReq.getSupplyId());
                if (supply != null && supply.getQuantity() >= supplyReq.getQuantityUsed()) {
                    // Thêm vào event supply
                    com.school_medical.school_medical_management_system.repositories.entites.MedicalEventSupply eventSupply = new com.school_medical.school_medical_management_system.repositories.entites.MedicalEventSupply();
                    eventSupply.setEventId(event.getEventId().intValue());
                    eventSupply.setSupplyId(supplyReq.getSupplyId());
                    eventSupply.setQuantityUsed(supplyReq.getQuantityUsed());
                    medicalEventSupplyRepository.addSupplyToEvent(eventSupply);
                    
                    // Trừ số lượng kho
                    supply.setQuantity(supply.getQuantity() - supplyReq.getQuantityUsed());
                    medicalSupplyRepository.updateSupply(supply);
                } else {
                    throw new RuntimeException("Thuốc " + (supply != null ? supply.getName() : supplyReq.getSupplyId()) + " không đủ số lượng trong kho!");
                }
            }
        }
        
        return event;
    }
}
